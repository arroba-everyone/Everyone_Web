import type { IPost } from '@everyone-web/services/getPosts';
import type { IBaseComponent } from '@everyone-web/types/global';
import { Link } from '@tanstack/react-router';

export const NewsItem: IBaseComponent<IPost> = ({
  slug,
  thumbnailUrl,
  author,
  publishedAt,
  title,
}) => {
  const formatDate = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffTime = Math.abs(now.getTime() - published.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 7) return `hace ${diffDays} días`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      return diffWeeks === 1 ? 'hace 1 semana' : `hace ${diffWeeks} semanas`;
    }

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return diffMonths === 1 ? 'hace 1 mes' : `hace ${diffMonths} meses`;
    }

    const diffYears = Math.floor(diffDays / 365);
    return diffYears === 1 ? 'hace 1 año' : `hace ${diffYears} años`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-7 laptop:gap-8 w-full">
      {/* Image Container */}
      <div className="w-full md:w-105 tablet-lg:w-110 laptop:w-115 laptop-lg:w-120 shrink-0">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col justify-between gap-4 md:gap-5 laptop:gap-6 flex-1">
        {/* Author and Date */}
        <div className="flex items-center gap-2 text-sm md:text-base">
          <span style={{ color: 'var(--color-primary)' }} className="font-medium">
            {author}
          </span>
          <span className="text-muted-foreground">·</span>
          <span style={{ color: 'var(--color-primary)' }} className="font-medium">
            {formatDate(publishedAt)}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/blog/$slug`}
          params={{ slug }}
          className="no-underline"
        >
          <h2 className="text-2xl md:text-3xl laptop:text-3xl laptop-lg:text-4xl font-bold text-foreground hover:text-primary transition-colors m-0 leading-tight">
            {title}
          </h2>
        </Link>

        {/* Ver más Link */}
        <Link
          to={`/blog/$slug`}
          params={{ slug }}
          className="inline-flex items-center gap-2 text-base md:text-lg font-medium no-underline transition-colors"
          style={{ color: 'var(--color-primary)' }}
        >
          Ver más →
        </Link>
      </div>
    </div>
  );
};
