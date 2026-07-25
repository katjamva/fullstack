const Header = ({course}) => (
  <>
    <h2>{course.name}</h2>
  </>
)

const Content = ({parts}) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Part = ({part}) => (
  <>
    <p>{part.name} {part.exercises}</p>
  </>
)

const Total = ({parts}) => {
  const total = parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  )

  return (
    <>
      <b>total of {total} exercises</b>
    </>
  )
}

const Course = ({course}) => (
  <>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>
)

export default Course