package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/jackc/pgx/v5/stdlib" // Driver Postgres
	"github.com/joho/godotenv"

	"lead-central/internal/auth"
	"lead-central/internal/middleware"
	"lead-central/internal/user"
	"lead-central/pkg/database"
)

func main() {
	// 1. Configuração de Variáveis de Ambiente
	// Tenta carregar do .env, mas não falha se não existir (para produção no Render/Railway)
	if err := godotenv.Load(); err != nil {
		log.Println("Info: Arquivo .env não encontrado, usando variáveis do ambiente do sistema.")
	}

	// 2. Conexão com o Banco de Dados (Neon)
	// Usa nossa função robusta criada em pkg/database
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("Erro: A variável DATABASE_URL é obrigatória.")
	}

	db, err := database.NewPostgresConnection(dbURL)
	if err != nil {
		log.Fatalf("Falha crítica ao conectar no banco: %v", err)
	}
	defer db.Close() // Garante que a conexão feche ao parar o servidor

	log.Println("✅ Conectado ao Neon (PostgreSQL) com sucesso!")

	// 3. Injeção de Dependências (Wiring)
	// Conecta: Banco -> Repositório -> Handler
	userRepo := user.NewRepository(db)
	authHandler := &auth.Handler{Repo: userRepo}

	// 4. Configuração do Servidor Web (Gin)
	r := gin.Default()

	// 5. Middleware de CORS (Crucial para o Next.js funcionar)
	// Permite que o front-end (localhost:3000 ou produção) converse com essa API
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // Em produção, troque "*" pela URL do seu front
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// 6. Definição de Rotas

	// Rota de Health Check (útil para o Render/Railway saber que o app subiu)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "central-leads-api"})
	})

	// Grupo de Autenticação (Público)
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
	}

	// Grupo Protegido (Requer Token JWT)
	// Exemplo: Rotas administrativas para criar usuários no futuro
	apiGroup := r.Group("/api")
	apiGroup.Use(middleware.AuthGuard())
	{
		apiGroup.GET("/me", func(c *gin.Context) {
			// Exemplo de como pegar dados do usuário logado (se você implementar extração no middleware)
			c.JSON(200, gin.H{"message": "Você está autenticado e tem acesso a área restrita."})
		})

		// Aqui entraria: apiGroup.POST("/users", userHandler.Create)
	}

	// 7. Inicialização do Servidor
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Porta padrão local
	}

	log.Printf("🚀 Servidor rodando na porta %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Erro ao iniciar o servidor: ", err)
	}
}
