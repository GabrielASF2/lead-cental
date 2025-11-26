package user

import (
	"encoding/json"
	"time"
)

// User representa a tabela no banco
type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // O "-" impede que a senha retorne no JSON
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`

	// ✅ ADICIONAR: Campos do Supabase
	SupabaseUrl        *string          `json:"supabase_url,omitempty"`
	SupabaseAnonKey    *string          `json:"supabase_anon_key,omitempty"`
	SupabaseConfigured bool             `json:"supabase_configured"`
	LeadsTableName     string           `json:"leads_table_name"`
	LeadsSchema        *json.RawMessage `json:"leads_schema,omitempty"`
	SchemaDetectedAt   *time.Time       `json:"schema_detected_at,omitempty"`
}

// ✅ MANTER: CreateUserRequest (NÃO MEXER)
type CreateUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// ✅ MANTER: LoginRequest (NÃO MEXER)
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// ✅ ADICIONAR: Novo struct para configurar Supabase
type ConfigureSupabaseRequest struct {
	SupabaseUrl     string          `json:"supabase_url" binding:"required,url"`
	SupabaseAnonKey string          `json:"supabase_anon_key" binding:"required"`
	TableName       string          `json:"table_name"`
	Schema          json.RawMessage `json:"schema" binding:"required"`
}
