import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CourseCard from '../../src/components/courses/CourseCard'

describe('CourseCard Component', () => {
  const mockCourse = {
    id: 1,
    name: 'Curso de Inglés',
    description: 'Curso completo de inglés para principiantes',
    level: 'A1',
    language: 'Inglés',
    imageUrl: '/test-image.jpg',
    status: 'activo'
  }

  const mockOnSelectCourse = vi.fn()

  it('Renderiza información del curso', () => {
    render(<CourseCard course={mockCourse} onSelectCourse={mockOnSelectCourse} />)
    
    expect(screen.getByText('Curso de Inglés')).toBeInTheDocument()
    expect(screen.getByText('Curso completo de inglés para principiantes')).toBeInTheDocument()
    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('Inglés')).toBeInTheDocument()
  })

  it('Llama a onSelectCourse cuando se hace clic en la tarjeta', async () => {
    const user = userEvent.setup()
    render(<CourseCard course={mockCourse} onSelectCourse={mockOnSelectCourse} />)
    
    const card = screen.getByText('Curso de Inglés').closest('.course-card')
    await user.click(card)
    
    expect(mockOnSelectCourse).toHaveBeenCalledWith(mockCourse)
  })

  it('Muestra imagen del curso', () => {
    render(<CourseCard course={mockCourse} onSelectCourse={mockOnSelectCourse} />)
    
    const image = screen.getByAltText('Curso de Inglés')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
  })

  it('Usa imagen por defecto si no hay imageUrl', () => {
    const courseWithoutImage = {
      ...mockCourse,
      imageUrl: null
    }
    
    render(<CourseCard course={courseWithoutImage} onSelectCourse={mockOnSelectCourse} />)
    
    const image = screen.getByAltText('Curso de Inglés')
    expect(image).toHaveAttribute('src', '/images/Logo.png')
  })

  it('Muestra badge para cursos planificados', () => {
    const plannedCourse = {
      ...mockCourse,
      status: 'planificado'
    }
    
    render(<CourseCard course={plannedCourse} onSelectCourse={mockOnSelectCourse} />)
    
    expect(screen.getByText(/Próximo lanzamiento/i)).toBeInTheDocument()
  })

  it('Trunca descripciones largas', () => {
    const longDescriptionCourse = {
      ...mockCourse,
      description: 'A'.repeat(150)
    }
    
    render(<CourseCard course={longDescriptionCourse} onSelectCourse={mockOnSelectCourse} />)
    
    const description = screen.getByText(/^A{100}…/)
    expect(description).toBeInTheDocument()
  })
})

