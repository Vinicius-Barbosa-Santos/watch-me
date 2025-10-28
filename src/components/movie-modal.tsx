import { useState, useEffect } from 'react'
import { X, Play, Star, Calendar, Clock, Users } from 'lucide-react'

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

interface MovieDetails extends Movie {
    runtime?: number
    genres?: { id: number; name: string }[]
    production_companies?: { id: number; name: string; logo_path: string }[]
    spoken_languages?: { iso_639_1: string; name: string }[]
    budget?: number
    revenue?: number
}

interface Video {
    id: string
    key: string
    name: string
    site: string
    type: string
    official: boolean
}

interface Cast {
    id: number
    name: string
    character: string
    profile_path: string
}

interface MovieModalProps {
    movie: Movie
    isOpen: boolean
    onClose: () => void
    getImageUrl: (path: string) => string
}

const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"
const BASE_URL = "https://api.themoviedb.org/3"

export const MovieModal = ({ movie, isOpen, onClose, getImageUrl }: MovieModalProps) => {
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
    const [videos, setVideos] = useState<Video[]>([])
    const [cast, setCast] = useState<Cast[]>([])
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'videos'>('overview')

    useEffect(() => {
        if (isOpen && movie) {
            fetchMovieDetails()
            fetchMovieVideos()
            fetchMovieCast()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, movie])

    const fetchMovieDetails = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`
            )
            const data = await response.json()
            setMovieDetails(data)
        } catch (error) {
            console.error('Erro ao buscar detalhes do filme:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchMovieVideos = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=pt-BR`
            )
            const data = await response.json()
            setVideos(data.results || [])
        } catch (error) {
            console.error('Erro ao buscar vídeos do filme:', error)
        }
    }

    const fetchMovieCast = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}&language=pt-BR`
            )
            const data = await response.json()
            setCast(data.cast?.slice(0, 12) || [])
        } catch (error) {
            console.error('Erro ao buscar elenco do filme:', error)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatRuntime = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${mins}min`
    }

    const formatRating = (rating: number) => {
        return (rating / 2).toFixed(1)
    }

    const getTrailer = () => {
        return videos.find(video =>
            video.type === 'Trailer' &&
            video.site === 'YouTube' &&
            video.official
        ) || videos.find(video =>
            video.type === 'Trailer' &&
            video.site === 'YouTube'
        )
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-2xl overflow-hidden">
                {/* Header com backdrop */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                    {movieDetails?.backdrop_path ? (
                        <img
                            src={getImageUrl(movieDetails.backdrop_path)}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted" />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Play button para trailer */}
                    {getTrailer() && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${getTrailer()?.key}`, '_blank')}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                <Play className="h-5 w-5" />
                                Assistir Trailer
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Title and basic info */}
                            <div className="mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">{movie.title}</h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(movie.release_date)}</span>
                                    </div>

                                    {movieDetails?.runtime && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{formatRuntime(movieDetails.runtime)}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span>{formatRating(movie.vote_average)} / 5</span>
                                    </div>
                                </div>

                                {/* Genres */}
                                {movieDetails?.genres && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {movieDetails.genres.map((genre) => (
                                            <span
                                                key={genre.id}
                                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-border mb-4">
                                <div className="flex gap-6">
                                    {[
                                        { id: 'overview' as const, label: 'Sinopse' },
                                        { id: 'cast' as const, label: 'Elenco' },
                                        { id: 'videos' as const, label: 'Vídeos' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`pb-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                                ? 'text-primary border-b-2 border-primary'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab content */}
                            {activeTab === 'overview' && (
                                <div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {movie.overview || 'Sem sinopse disponível.'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'cast' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {cast.map((actor) => (
                                        <div key={actor.id} className="text-center">
                                            <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-muted">
                                                {actor.profile_path ? (
                                                    <img
                                                        src={getImageUrl(actor.profile_path)}
                                                        alt={actor.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Users className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-medium text-sm">{actor.name}</h4>
                                            <p className="text-xs text-muted-foreground">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'videos' && (
                                <div className="space-y-3">
                                    {videos.length > 0 ? (
                                        videos.slice(0, 5).map((video) => (
                                            <div
                                                key={video.id}
                                                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div>
                                                    <h4 className="font-medium">{video.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{video.type}</p>
                                                </div>
                                                <button
                                                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank')}
                                                    className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                                                >
                                                    <Play className="h-3 w-3" />
                                                    Assistir
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            Nenhum vídeo disponível
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}