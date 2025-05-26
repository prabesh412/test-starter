# DropShop - Modern Dropshipping Website

A modern, responsive dropshipping e-commerce website built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🛍️ **Modern E-commerce Design** - Clean, responsive design with mobile-first approach
- 🔍 **Product Search & Filtering** - Advanced search and filtering capabilities
- 📱 **Responsive Layout** - Optimized for all device sizes
- 🎨 **Beautiful UI Components** - Built with Shadcn UI and Radix UI
- ⚡ **Fast Performance** - Server-side rendering with Next.js App Router
- 🔐 **Authentication Ready** - Supabase auth integration
- 💳 **Payment Ready** - Stripe integration ready
- 🎯 **SEO Optimized** - Meta tags and structured data
- 🌙 **Dark Mode Support** - Theme switching capability

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Database**: Supabase
- **Icons**: Lucide React
- **State Management**: Nuqs for URL state

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── products/          # Products pages
│   └── categories/        # Categories pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── products/         # Product-specific components
├── lib/                  # Utility functions and configurations
│   ├── types.ts          # TypeScript interfaces
│   ├── utils.ts          # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── database.types.ts # Database type definitions
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd next-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

   Create the following tables in your Supabase database:

   **Products Table:**

   ```sql
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     compare_at_price DECIMAL(10,2),
     images TEXT[] DEFAULT '{}',
     category TEXT NOT NULL,
     subcategory TEXT,
     tags TEXT[] DEFAULT '{}',
     in_stock BOOLEAN DEFAULT true,
     stock_quantity INTEGER DEFAULT 0,
     sku TEXT UNIQUE NOT NULL,
     weight DECIMAL(8,2),
     dimensions JSONB,
     supplier TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **Categories Table:**

   ```sql
   CREATE TABLE categories (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     description TEXT,
     image TEXT,
     parent_id UUID REFERENCES categories(id),
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **Orders Table:**

   ```sql
   CREATE TABLE orders (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID NOT NULL,
     order_number TEXT UNIQUE NOT NULL,
     status TEXT DEFAULT 'pending',
     total_amount DECIMAL(10,2) NOT NULL,
     shipping_address JSONB NOT NULL,
     billing_address JSONB NOT NULL,
     payment_method TEXT NOT NULL,
     payment_status TEXT DEFAULT 'pending',
     shipping_method TEXT NOT NULL,
     shipping_cost DECIMAL(10,2) DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Key Components

### Layout Components

- `Header` - Navigation with search, cart, and user menu
- `Footer` - Links, contact info, and social media

### Product Components

- `ProductCard` - Individual product display with image, price, and actions
- `ProductGrid` - Responsive grid layout for multiple products

### UI Components

- `Button` - Customizable button with variants
- `Card` - Container component for content
- `Input` - Form input component

## Customization

### Styling

The project uses Tailwind CSS with custom CSS variables defined in `app/globals.css`. You can customize:

- Colors in the CSS variables
- Component styles in individual component files
- Global styles in `globals.css`

### Adding New Pages

1. Create a new folder in the `app` directory
2. Add a `page.tsx` file with your component
3. Update navigation links in the Header component

### Database Integration

- Update `lib/supabase.ts` for database queries
- Modify `lib/types.ts` for new data structures
- Update `lib/database.types.ts` when database schema changes

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js, TypeScript, and Supabase.
