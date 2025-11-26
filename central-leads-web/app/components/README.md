# Componentes - Central de Leads

Esta pasta contém todos os componentes reutilizáveis do projeto, organizados por categoria.

## 📦 Componentes de UI Base

### Button
Botão reutilizável com múltiplas variantes e estado de loading.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `fullWidth`: boolean

**Exemplo:**
```tsx
<Button variant="primary" size="lg" isLoading={pending}>
  Enviar
</Button>
```

### Input
Campo de input com label opcional, ícone e mensagem de erro.

**Props:**
- `label`: string (opcional)
- `icon`: ReactNode (opcional)
- `error`: string (opcional)
- Todas as props padrão de HTMLInputElement

**Exemplo:**
```tsx
<Input
  label="Email"
  type="email"
  icon={<Mail className="h-5 w-5" />}
  placeholder="seu@email.com"
/>
```

### FormField
Combinação de label + input + ícone (similar ao Input, mas sempre com label).

**Props:**
- `label`: string (obrigatório)
- `icon`: ReactNode (opcional)
- `error`: string (opcional)

**Exemplo:**
```tsx
<FormField
  name="email"
  label="Email"
  icon={<Mail className="h-5 w-5" />}
  required
/>
```

### Badge
Badge/tag para categorização visual.

**Props:**
- `variant`: 'blue' | 'green' | 'slate' | 'gray'
- `size`: 'sm' | 'md'

**Exemplo:**
```tsx
<Badge variant="blue">Premium</Badge>
```

### ErrorMessage
Mensagem de erro estilizada.

**Props:**
- `message`: string

**Exemplo:**
```tsx
{error && <ErrorMessage message={error} />}
```

---

## 🎨 Componentes de Layout

### Header
Header fixo do dashboard com logo, título e ações.

**Props:**
- `showNewUserButton`: boolean (default: true)

**Exemplo:**
```tsx
<Header showNewUserButton={true} />
```

### Card
Container genérico com bordas e sombra.

**Props:**
- `padding`: 'none' | 'sm' | 'md' | 'lg'

**Exemplo:**
```tsx
<Card padding="lg">
  <h2>Conteúdo</h2>
</Card>
```

### KPICard
Card específico para exibir métricas/KPIs.

**Props:**
- `label`: string
- `value`: string | number

**Exemplo:**
```tsx
<KPICard label="Total de Leads" value={150} />
```

### AuthCard
Container para formulários de autenticação.

**Props:**
- `title`: string
- `subtitle`: string (opcional)

**Exemplo:**
```tsx
<AuthCard title="Login" subtitle="Faça login para continuar">
  <form>...</form>
</AuthCard>
```

---

## 🎯 Componentes Específicos

### WhatsAppButton
Botão/link estilizado para abrir conversa no WhatsApp.

**Props:**
- `phone`: string (obrigatório)
- `displayPhone`: string (opcional - se não fornecido, usa `phone`)

**Exemplo:**
```tsx
<WhatsAppButton phone="11999999999" />
```

---

## 📊 Componentes de Tabela

### LeadsTable
Tabela completa para exibição de leads com componentes internos.

**Props:**
- `leads`: Lead[]

**Tipo Lead:**
```typescript
interface Lead {
  id: string
  created_at: string
  name: string
  email?: string | null
  whatsapp: string
  interest: string
  produto?: string | null
  campanha?: string | null
}
```

**Exemplo:**
```tsx
<LeadsTable leads={leads} />
```

**Componentes internos:**
- `LeadsTableHeader`: Cabeçalho da tabela
- `LeadsTableRow`: Linha individual com formatação de data e links

---

## 📁 Estrutura de Arquivos

```
app/components/
├── README.md                    # Este arquivo
├── index.ts                     # Export barrel de todos os componentes
│
├── Button.tsx                   # Botão reutilizável
├── Input.tsx                    # Input com label e ícone
├── FormField.tsx                # Campo de formulário completo
├── Badge.tsx                    # Badge/tag
├── ErrorMessage.tsx             # Mensagem de erro
│
├── Header.tsx                   # Header do dashboard
├── Card.tsx                     # Container genérico
├── KPICard.tsx                  # Card de métrica
├── AuthCard.tsx                 # Card de autenticação
│
├── WhatsAppButton.tsx           # Botão do WhatsApp
│
└── LeadsTable/                  # Componentes de tabela
    ├── index.ts                 # Export
    ├── LeadsTable.tsx           # Wrapper principal
    ├── LeadsTableHeader.tsx     # Cabeçalho
    └── LeadsTableRow.tsx        # Linha da tabela
```

---

## 🚀 Importação

Todos os componentes podem ser importados do barrel export:

```tsx
import { 
  Button, 
  Input, 
  Badge, 
  ErrorMessage,
  Header,
  LeadsTable,
  type Lead 
} from '@/app/components'
```

---

## ✅ Benefícios da Componentização

1. **Reutilização**: Componentes podem ser usados em múltiplas páginas
2. **Manutenção**: Alterações em um lugar refletem em todo o projeto
3. **Consistência**: Design system unificado
4. **Tipagem**: TypeScript garante type safety
5. **Testabilidade**: Componentes isolados são mais fáceis de testar
6. **DRY**: Don't Repeat Yourself - código mais limpo

---

## 📈 Páginas Refatoradas

- ✅ `/login` - Usa Button, FormField, ErrorMessage, AuthCard
- ✅ `/register` - Usa Button, Input, ErrorMessage, Card
- ✅ `/dashboard` - Usa Header, KPICard, LeadsTable (completo)

---

## 🎯 Próximos Passos Sugeridos

1. Adicionar testes unitários para cada componente
2. Criar Storybook para documentação visual
3. Adicionar mais variantes conforme necessário
4. Criar componentes de Loading/Skeleton
5. Adicionar componente de Modal/Dialog
6. Criar componente de Toast/Notification

