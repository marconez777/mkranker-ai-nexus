export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analise_funil_busca: {
        Row: {
          created_at: string
          id: string
          micro_nicho: string
          publico_alvo: string
          resultado: string
          segmento: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          micro_nicho: string
          publico_alvo: string
          resultado: string
          segmento: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          micro_nicho?: string
          publico_alvo?: string
          resultado?: string
          segmento?: string
          user_id?: string
        }
        Relationships: []
      }
      analise_mercado: {
        Row: {
          created_at: string
          id: string
          nicho: string
          problema: string
          resultado: string
          segmentos: string
          servico_foco: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nicho: string
          problema: string
          resultado: string
          segmentos: string
          servico_foco: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nicho?: string
          problema?: string
          resultado?: string
          segmentos?: string
          servico_foco?: string
          user_id?: string
        }
        Relationships: []
      }
      meta_dados: {
        Row: {
          created_at: string
          id: string
          nome_site: string
          palavra_chave_foco: string
          palavra_relacionada: string
          resultado: string | null
          tipo_pagina: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome_site: string
          palavra_chave_foco: string
          palavra_relacionada: string
          resultado?: string | null
          tipo_pagina: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome_site?: string
          palavra_chave_foco?: string
          palavra_relacionada?: string
          resultado?: string | null
          tipo_pagina?: string
          user_id?: string
        }
        Relationships: []
      }
      palavras_chaves: {
        Row: {
          created_at: string
          id: string
          palavras_fundo: string[]
          resultado: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          palavras_fundo: string[]
          resultado?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          palavras_fundo?: string[]
          resultado?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pautas_blog: {
        Row: {
          created_at: string
          id: string
          palavra_chave: string
          resultado: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          palavra_chave: string
          resultado: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          palavra_chave?: string
          resultado?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          plan_type: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          plan_type?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          plan_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      texto_seo_blog: {
        Row: {
          created_at: string
          id: string
          observacoes: string | null
          palavra_chave: string
          palavras_relacionadas: string[]
          resultado: string
          tema: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          observacoes?: string | null
          palavra_chave: string
          palavras_relacionadas: string[]
          resultado: string
          tema: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          observacoes?: string | null
          palavra_chave?: string
          palavras_relacionadas?: string[]
          resultado?: string
          tema?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      texto_seo_lp: {
        Row: {
          created_at: string
          id: string
          observacoes: string | null
          palavra_chave: string
          palavras_relacionadas: string[]
          resultado: string
          tema: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          observacoes?: string | null
          palavra_chave: string
          palavras_relacionadas: string[]
          resultado: string
          tema: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          observacoes?: string | null
          palavra_chave?: string
          palavras_relacionadas?: string[]
          resultado?: string
          tema?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      texto_seo_produto: {
        Row: {
          created_at: string
          id: string
          nome_produto: string
          observacoes: string | null
          palavra_chave: string
          palavras_relacionadas: string[]
          resultado: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome_produto: string
          observacoes?: string | null
          palavra_chave: string
          palavras_relacionadas: string[]
          resultado: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome_produto?: string
          observacoes?: string | null
          palavra_chave?: string
          palavras_relacionadas?: string[]
          resultado?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          created_at: string
          funil_busca: number | null
          id: string
          mercado_publico_alvo: number | null
          meta_dados: number | null
          palavras_chaves: number | null
          pautas_blog: number | null
          texto_seo_blog: number | null
          texto_seo_lp: number | null
          texto_seo_produto: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          funil_busca?: number | null
          id?: string
          mercado_publico_alvo?: number | null
          meta_dados?: number | null
          palavras_chaves?: number | null
          pautas_blog?: number | null
          texto_seo_blog?: number | null
          texto_seo_lp?: number | null
          texto_seo_produto?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          funil_busca?: number | null
          id?: string
          mercado_publico_alvo?: number | null
          meta_dados?: number | null
          palavras_chaves?: number | null
          pautas_blog?: number | null
          texto_seo_blog?: number | null
          texto_seo_lp?: number | null
          texto_seo_produto?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
