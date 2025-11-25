package user

import "time"

// User representa a tabela no banco
type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // O "-" impede que a senha retorne no JSON
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

// CreateUserRequest define o payload para criar usuário
type CreateUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest define o payload de login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
