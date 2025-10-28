import { useState } from "react"
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "./components/ui/sidebar"
import {
  HomeIcon,
  PlayIcon,
  SearchIcon,
  TrendingUpIcon,
  LoaderIcon
} from "lucide-react"
import { useMovies } from "./hooks/use-movies"
import { MovieCard } from "./components/movie-card"
import { MovieModal } from "./components/movie-modal"

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

export const App = () => {
  const [activeCategory, setActiveCategory] = useState<'popular' | 'top_rated' | 'upcoming' | 'now_playing'>('popular')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { movies, loading, error, getImageUrl } = useMovies(activeCategory)

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMovie(null)
  }

  const getCategoryTitle = (category: string) => {
    const titles = {
      popular: 'Filmes Populares',
      top_rated: 'Mais Bem Avaliados',
      upcoming: 'Em Breve',
      now_playing: 'Em Cartaz'
    }
    return titles[category as keyof typeof titles] || 'Filmes'
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="sidebar" collapsible="icon">
          {/* Header da Sidebar */}
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <PlayIcon className="h-6 w-6 text-red-500" />
              <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
                WatchMe
              </span>
            </div>
          </SidebarHeader>

          {/* Conteúdo da Sidebar */}
          <SidebarContent>
            {/* Grupo Principal */}
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Populares"
                      isActive={activeCategory === 'popular'}
                      onClick={() => setActiveCategory('popular')}
                    >
                      <HomeIcon />
                      <span>Populares</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Em Alta"
                      isActive={activeCategory === 'top_rated'}
                      onClick={() => setActiveCategory('top_rated')}
                    >
                      <TrendingUpIcon />
                      <span>Mais Avaliados</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Em Cartaz"
                      isActive={activeCategory === 'now_playing'}
                      onClick={() => setActiveCategory('now_playing')}
                    >
                      <PlayIcon />
                      <span>Em Cartaz</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Em Breve"
                      isActive={activeCategory === 'upcoming'}
                      onClick={() => setActiveCategory('upcoming')}
                    >
                      <SearchIcon />
                      <span>Em Breve</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Conteúdo Principal */}
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">{getCategoryTitle(activeCategory)}</h1>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <LoaderIcon className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando filmes...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-red-500 mb-2">Erro ao carregar filmes</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && movies.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    getImageUrl={getImageUrl}
                    onClick={() => handleMovieClick(movie)}
                  />
                ))}
              </div>
            )}

            {!loading && !error && movies.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Nenhum filme encontrado</p>
              </div>
            )}
          </div>
        </SidebarInset>

        {/* Modal de detalhes do filme */}
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            getImageUrl={getImageUrl}
          />
        )}
      </div>
    </SidebarProvider>
  )
}