package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib" // Importa o driver pgx implicitamente
)

// NewPostgresConnection inicializa a conexão com o banco e configura o Pool
func NewPostgresConnection(connectionString string) (*sql.DB, error) {
	// 1. Abre a conexão usando o driver pgx
	db, err := sql.Open("pgx", connectionString)
	if err != nil {
		return nil, fmt.Errorf("erro ao abrir conexão: %w", err)
	}

	// 2. Verifica se o banco está realmente acessível (Fail Fast)
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("erro ao pingar o banco: %w", err)
	}

	// 3. Configuração do Connection Pool (CRUCIAL para Neon/Serverless)

	// Define o número máximo de conexões abertas simultaneamente.
	// Para um MVP, 25 é um bom número. Se crescer, ajuste conforme o plano do Neon.
	db.SetMaxOpenConns(25)

	// Define quantas conexões ficam "dormindo" prontas para uso.
	// Não deixe muito alto para não consumir recursos do Neon sem necessidade.
	db.SetMaxIdleConns(10)

	// Tempo máximo que uma conexão pode ser reutilizada.
	// 5 minutos é seguro para evitar problemas de firewall/network cortando conexões longas.
	db.SetConnMaxLifetime(5 * time.Minute)

	return db, nil
}
