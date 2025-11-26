package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Handler struct {
	Repo *Repository
}

// ConfigureSupabase permite o usuário configurar suas credenciais
func (h *Handler) ConfigureSupabase(c *gin.Context) {
	// Extrai user_id do JWT (vindo do middleware)
	claims := c.MustGet("claims").(jwt.MapClaims)
	userId := claims["sub"].(string)

	var req ConfigureSupabaseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Salva configuração
	if err := h.Repo.UpdateSupabaseConfig(userId, req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao salvar configuração",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Supabase configurado com sucesso",
	})
}

// GetSupabaseConfig retorna as credenciais do Supabase do usuário
func (h *Handler) GetSupabaseConfig(c *gin.Context) {
	claims := c.MustGet("claims").(jwt.MapClaims)
	userId := claims["sub"].(string)

	config, err := h.Repo.GetSupabaseConfig(userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Supabase não configurado",
		})
		return
	}

	// Retorna apenas os dados necessários (sem senha!)
	c.JSON(http.StatusOK, gin.H{
		"supabase_url":      config.SupabaseUrl,
		"supabase_anon_key": config.SupabaseAnonKey,
		"leads_table_name":  config.LeadsTableName,
		"leads_schema":      config.LeadsSchema,
	})
}
