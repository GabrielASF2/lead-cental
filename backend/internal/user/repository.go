package user

import (
	"database/sql"
	"errors"
	"lead-central/pkg/crypto"
)

type Repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

func (r *Repository) Create(u *User) error {
	query := `INSERT INTO users (name, email, password_hash, role) 
              VALUES ($1, $2, $3, $4) RETURNING id, created_at`

	// Scan preenche o ID e CreatedAt gerados pelo banco no ponteiro user
	return r.DB.QueryRow(query, u.Name, u.Email, u.PasswordHash, u.Role).Scan(&u.ID, &u.CreatedAt)
}

func (r *Repository) GetByEmail(email string) (*User, error) {
	u := &User{}
	query := `SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1`

	err := r.DB.QueryRow(query, email).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("usuário não encontrado")
		}
		return nil, err
	}
	return u, nil
}

func (r *Repository) UpdateSupabaseConfig(userId string, req ConfigureSupabaseRequest) error {
	// Criptografa a chave
	encryptedKey, err := crypto.Encrypt(req.SupabaseAnonKey)
	if err != nil {
		return err
	}

	// Se não passou nome da tabela, usa "leads" como padrão
	tableName := req.TableName
	if tableName == "" {
		tableName = "leads"
	}

	// Atualiza configuração do Supabase no usuário
	query := `UPDATE users 
              SET supabase_url = $1, 
                  supabase_anon_key = $2,
                  leads_table_name = $3,
                  leads_schema = $4,
                  supabase_configured = true,
                  schema_detected_at = NOW()
              WHERE id = $5`

	_, err = r.DB.Exec(query,
		req.SupabaseUrl,
		encryptedKey,
		tableName,
		req.Schema,
		userId,
	)
	return err
}

func (r *Repository) GetSupabaseConfig(userId string) (*User, error) {
	u := &User{}

	// 1️⃣ Busca APENAS campos do Supabase (não precisa de senha, etc)
	query := `SELECT supabase_url, supabase_anon_key, leads_table_name, leads_schema
              FROM users 
              WHERE id = $1 AND supabase_configured = true`

	var encryptedKey string

	// 2️⃣ Faz SELECT
	err := r.DB.QueryRow(query, userId).Scan(
		&u.SupabaseUrl,    // URL do Supabase do cliente
		&encryptedKey,     // Key criptografada
		&u.LeadsTableName, // Nome da tabela
		&u.LeadsSchema,    // Schema JSON
	)

	if err != nil {
		return nil, err // Não configurou ainda ou não existe
	}

	// 3️⃣ Descriptografa a key
	decryptedKey, err := crypto.Decrypt(encryptedKey)
	if err != nil {
		return nil, err
	}
	u.SupabaseAnonKey = &decryptedKey // Key descriptografada

	return u, nil
}
