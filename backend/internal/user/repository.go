package user

import (
	"database/sql"
	"errors"
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
