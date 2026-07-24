import { useState } from 'react'

const DisplayMostVotes = ({votes, anecdotes}) => {
  const maxVotes = Math.max(...votes)
  console.log(maxVotes)
  const indexOfMaxVotes = votes.indexOf(maxVotes)
  if (maxVotes === 0) {
    return (
    <>
      <p>No votes yet</p>
    </>
    )
  }
  return (
    <>
      <p>{anecdotes[indexOfMaxVotes]}</p>
      <p>has {votes[indexOfMaxVotes]} votes</p>
    </>
  )
}

const Header = ({text}) => {
  return (
    <>
      <h2>{text}</h2>
    </>
  )
}

const DisplayVotes = ({votes, selected}) => {
  return (
    <>
    <p>has {votes[selected]} votes</p>
    </>
  )
  }

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {

  const headers = {
    anec_of_day: "Anecdote of the day",
    most_votes: "Anecdote with most votes"
  }

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const HandleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const HandleClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }


  return (
    <>
      <Header text={headers.anec_of_day}/>
      <p>{anecdotes[selected]}</p>
      <DisplayVotes votes={votes} selected={selected} />
      <Button handleClick={HandleVote} text="vote" />
      <Button handleClick={HandleClick} text="next anecdote" />
      <Header text={headers.most_votes} />
      <DisplayMostVotes votes={votes} anecdotes={anecdotes} />
    </>

  )
}

export default App