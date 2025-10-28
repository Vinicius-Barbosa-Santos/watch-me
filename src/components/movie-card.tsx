import { StarIcon, CalendarIcon } from "lucide-react"

interface Movie {
    id: number
    title: string
    overview: string
    poster_path: string
    backdrop_path: string
    release_date: string
    vote_average: number
    genre_ids: number[]
}

interface MovieCardProps {
    movie: Movie
    getImageUrl: (path: string) => string
    onClick: () => void
}

export const MovieCard = ({ movie, getImageUrl, onClick }: MovieCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short'
        })
    }

    const formatRating = (rating: number) => {
        return (rating / 2).toFixed(1) // Converte de 0-10 para 0-5
    }

    return (
        <div
            className="group relative overflow-hidden rounded-lg bg-card border border-border hover:shadow-xl hover:shadow-black/20 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
            onClick={onClick}
        >
            {/* Poster */}
            <div className="aspect-[2/3] overflow-hidden">
                {movie.poster_path ? (
                    <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Sem imagem</span>
                    </div>
                )}
            </div>

            {/* Informações */}
            <div className="p-3 bg-card">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors text-card-foreground">
                    {movie.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{formatDate(movie.release_date)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{formatRating(movie.vote_average)}</span>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3">
                    {movie.overview || 'Sem descrição disponível'}
                </p>
            </div>

            {/* Overlay de hover com gradiente dark */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="text-white p-4 w-full">
                    <h4 className="font-bold mb-2 text-lg">{movie.title}</h4>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{formatRating(movie.vote_average)}</span>
                        </div>
                        <span className="text-sm opacity-80">{formatDate(movie.release_date)}</span>
                    </div>
                    <p className="text-sm opacity-90 line-clamp-4">
                        {movie.overview || 'Sem descrição disponível'}
                    </p>
                    <div className="mt-3 text-xs opacity-75">
                        Clique para ver detalhes
                    </div>
                </div>
            </div>
        </div>
    )
}