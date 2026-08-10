# Concreto Brasil — Landing Page

Landing page genérica para empresa de concreto e materiais para construção, inspirada apenas em referências visuais e padrões comuns do setor.

## Estrutura

- Hero comercial com CTA para WhatsApp
- Concreto usinado
- Bombeamento
- Agregados
- Argamassas
- Diferenciais
- Consulta de região atendida
- Institucional genérico
- FAQ
- CTA flutuante de WhatsApp
- Layout responsivo

## Alterar o WhatsApp

Abra `script.js` e troque:

```js
const WHATSAPP_NUMBER = '5511999999999';
```

Use apenas números, com `55` + DDD + telefone.

## Alterar nome da empresa

Procure por `CONCRETO` e `BRASIL` em `index.html` e substitua pelo nome desejado.

## Alterar imagens

As imagens atuais são carregadas por URLs externas do Unsplash. Você pode substituir os links `images.unsplash.com` em `styles.css` por imagens próprias.

## Publicação

É um site estático. Pode ser publicado em GitHub Pages, Vercel, Netlify, Cloudflare Pages, EasyPanel/Nginx ou qualquer hospedagem de HTML estático.

## Observação

Antes de colocar a landing em produção, substitua os textos genéricos por informações reais da empresa, incluindo área de atendimento, produtos, políticas, contato e dados jurídicos aplicáveis.