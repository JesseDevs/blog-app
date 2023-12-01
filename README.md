# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Init Setup

-   npx nuxi@latest init **my-app**
-   npm install
-   npm i @pinia/nuxt nuxt-icon uuid @nuxt/image-edge
-   npm i pinia -f
-   npm install sass sass-loader --save-dev
-   npm install @nuxtjs/supabase --save-dev

## Folder Setup

-   assets/css
-   components
-   composables
-   error.vue
-   .env
-   layouts
-   middleware
-   pages
-   services
-   fix up nuxt.config

## Supabase Prisma Setup

After you install supabase...

-   create .env file with SUPABASE_URL & \_KEY
-   npm install prisma
-   npx prisma init
-   change DATABASE_URL with supabase connection string and password
