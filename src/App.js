import styled from 'styled-components'
import './App.css';
import {useEffect, useState} from 'react'

//棋盤格子
const Square = styled.div `
  width: 20px;
  height: 20px;
  border: solid 1px black;
  box-sizing: border-box;
`
const ResetButton = styled.button `
  width: 100px;
  height : 30px;
  margin-right: 10px;
`
//棋子
function Block({handleClick, block, id}) {
  return (
    <div className="Block" onClick={() => handleClick(id)}>
      {block &&
        <div className={block === "B"? "black": "white"} />
      }
    </div>
  )
}
//棋子範圍
function BlockArea({blocks, handleClick}) {
  return (
    <div className="BlockArea">
      {blocks.map((value, index) => 
        <Block handleClick={handleClick} block={value} key={index} id={index}>
        </Block>
      )}
    </div>
  )
}
//棋盤範圍
function BoardArea() {
  const squares = Array(18*18).fill(null)
  return (
    <div className="BoardArea">
      {squares.map((item, index) => <Square key={index}></Square>)}
    </div>
  )
}

function GameArea({blocks, handleClick}) {
  return (
    <div className="GameArea">
      <BoardArea></BoardArea>
      <BlockArea blocks={blocks} handleClick={handleClick}></BlockArea>
    </div>
  )
}

function Game() {
  const blocks = Array(19*19).fill(null)
  const history = [blocks]
  const originState = {
    step : 0,
    history : history,
    blocks: blocks,
    isNextBlack: true
  }

  const [state, setState] = useState(originState)

  function handleClick(id) { //回傳 block id
    //防止重複下棋
    if(state.blocks[id]) return

    let {step, history, blocks, isNextBlack} = state
    const newBlocks = blocks.slice()
    newBlocks[id] = isNextBlack? "B" : "W"
    history.push(newBlocks)
    setState({
      step : step+1,
      history: history,
      blocks: newBlocks,
      isNextBlack: !isNextBlack
    })
  }

  function handleReset() {
    setState(originState)
  }

  function handleReturn() {
    if(state.history.length >= 2) {
      const lastHistory = state.history.slice(0, state.history.length-1)
      const lastBlocks = state.history[state.history.length-2]
      setState({
        ...state,
        history: lastHistory,
        blocks: lastBlocks,
        isNextBlack: !state.isNextBlack
      })
    }
    return
  }

  useEffect(() => {
    calculateWinner()
  })

  function calculateWinner() {
    const lines = [
      [0,1,2,3,4],
      [19,20,21,22,23],
      [38,39,40,41,42],
      [57,58,59,60,61],
      [76,77,78,79,80],
      [0,19,38,57,76],
      [1,20,39,58,77],
      [2,21,40,59,78],
      [3,22,41,60,79],
      [4,23,42,61,80],
      [0,20,40,60,80],
      [4,22,40,58,76]
    ]
    //基本組合解
    function checkMethod(state, lines) {
      const blocks = state.blocks
      for(let i=0; i<lines.length; i++) {
        const [a,b,c,d,e] = lines[i]
        if(blocks[a] && blocks[a] === blocks[b] && blocks[a] === blocks[c] && blocks[a] === blocks[d] && blocks[a] === blocks[e]) {
          if(blocks[a] === "B") {alert('black win')}
          else {alert('white win')}
          handleReset()
          return
        }
      }
    }
    
    //遍歷所有組合
    const allLines = []
    for(let i=0; i<=280; i++) {
      const newLines = lines.map(line => line.map(block => block+i))
      newLines.map(line => allLines.push(line))
    }
    checkMethod(state, allLines)
  }

  return (
    <div className="game">
      <div className="title">
        GoBang Challenge
      </div>
      <GameArea blocks={state.blocks} handleClick={handleClick}>
      </GameArea>
      <div className="status">
        {state.isNextBlack? "換黑子下棋" : "換白子下棋" }
      </div>
      <ResetButton onClick={handleReset}>重新開始</ResetButton>
      <ResetButton onClick={handleReturn}>回到上一步</ResetButton>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Game>
      </Game>
    </div>
  );
}

export default App;
