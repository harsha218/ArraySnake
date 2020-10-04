import React from 'react';
import git from './GitHub-Mark-32px.png'
import './App.css';
import { Sliders } from 'react-bootstrap-icons'
import { Card, Button, Table, Container, Navbar, Nav, Jumbotron } from 'react-bootstrap';

const arrow = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT', SPACE: 'SPACE' }
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			sizeModal: true,
			scoreModel: false,
			size: 10,
			board: null,
			movement: arrow.SPACE,
			head: null,
			tail: null,
			snakeLength: 1,
			outcome: '',
			gameover: false,
			snakeQueue: [],
			intervalId: null,
			interval: 400
		}
	}

	componentDidMount() {
		window.addEventListener('keypress', this.handlekeys);
		let intervalId = setInterval(this.moveHandler, 400);
		this.setState({ intervalId });
		this.makeBoard();
	}

	componentWillUnmount() {
		window.removeEventListener('keypress', this.handlekeys);
		clearInterval(this.state.intervalId);
	}

	makeBoard = () => {
		let size = this.state.size;
		let board = [];
		let head, tail;
		let snakeQueue = [];
		for (let i = 0; i < size; i++) {
			board[i] = [];
			for (let j = 0; j < size; j++) {
				board[i][j] = 0;
			}
		}
		if (size % 2 == 0) {
			board[size / 2][size / 2] = 'S';
			head = [size / 2, size / 2];
			tail = [size / 2, size / 2];
			snakeQueue.push([size / 2, size / 2]);
		} else {
			board[(size - 1) / 2][(size - 1) / 2] = 'S';
			head = [(size - 1) / 2, (size - 1) / 2];
			tail = [(size - 1) / 2, (size - 1) / 2];
			snakeQueue.push([size / 2, size / 2]);
		}
		let r = Math.floor((Math.random() * (size - 1)));
		let c = Math.floor((Math.random() * (size - 1)));
		while (board[r][c] != 0) {
			r = Math.floor((Math.random() * (size - 1)));
			c = Math.floor((Math.random() * (size - 1)));
		}
		board[r][c] = '*';
		this.setState({
			sizeModal: false,
			scoreModel: false,
			board,
			head,
			tail,
			snakeQueue,
			outcome: '',
			gameover: false,
			snakeLength: 1
		});
	}

	handlekeys = (e) => {
		if (!this.state.sizeModal && !this.state.scoreModel) {
			let prev = this.state.movement;
			if (e.key === 'w' || e.key === 'W') {
				if (prev !== arrow.DOWN) {
					this.setState({ movement: arrow.UP });
				}
			} else if (e.key === 's' || e.key === 'S') {
				if (prev !== arrow.UP) {
					this.setState({ movement: arrow.DOWN });
				}
			} else if (e.key === 'a' || e.key === 'A') {
				if (prev !== arrow.RIGHT) {
					this.setState({ movement: arrow.LEFT });
				}
			} else if (e.key === 'd' || e.key === 'D') {
				if (prev !== arrow.LEFT) {
					this.setState({ movement: arrow.RIGHT });
				}
			} else if (e.key === ' ') {
				if (prev !== arrow.SPACE) {
					this.setState({ movement: arrow.SPACE });
				}
			}
		}
	}

	moveHandler = () => {
		if (!this.state.sizeModal && !this.state.scoreModel) {
			let e = this.state.movement;
			if (e !== arrow.SPACE) {
				this.checkAndMove();
			}
		}
	}

	checkAndMove = () => {
		console.log(this.state);
		let { movement, head, tail, board, size, snakeLength, snakeQueue } = this.state;
		let hr, hc, tr, tc;
		if (movement === arrow.UP) {
			hr = -1;
			hc = 0;
		} else if (movement === arrow.DOWN) {
			hr = 1;
			hc = 0;
		} else if (movement === arrow.LEFT) {
			hr = 0;
			hc = -1;
		} else if (movement === arrow.RIGHT) {
			hr = 0;
			hc = 1;
		}
		hr += head[0];
		hc += head[1];
		tr = tail[0];
		tc = tail[1];
		console.log(hr, hc, size);
		if (hr >= size || hc >= size || hr < 0 || hc < 0) {
			console.log('You hit a wall');
			this.setState({ outcome: 'You hit a wall', gameover: true, scoreModel: true, movement: arrow.SPACE });
		} else if (board[hr][hc] == 1) {
			console.log('You hit yourself');
			this.setState({ outcome: 'You hit yourself', gameover: true, scoreModel: true, movement: arrow.SPACE });
		} else if (board[hr][hc] == '*') {
			board[hr][hc] = 'S';
			let lasthead = snakeQueue.pop();
			board[lasthead[0]][lasthead[1]] = this.returnArrow(movement);
			snakeQueue.push(lasthead);
			snakeQueue.push([hr, hc]);
			let r = Math.floor((Math.random() * (size - 1)));
			let c = Math.floor((Math.random() * (size - 1)));
			while (board[r][c] != 0) {
				r = Math.floor((Math.random() * (size - 1)));
				c = Math.floor((Math.random() * (size - 1)));
			}
			board[r][c] = '*';
			this.setState({ head: [hr, hc], board, snakeLength: snakeLength + 1, snakeQueue });
		} else if (board[hr][hc] == 0) {
			board[hr][hc] = 'S';
			let lasthead = snakeQueue.pop();
			board[lasthead[0]][lasthead[1]] = this.returnArrow(movement);
			snakeQueue.push(lasthead);
			snakeQueue.push([hr, hc]);
			let co = snakeQueue.shift();
			board[co[0]][co[1]] = 0;
			this.setState({ head: [hr, hc], tail: [tr, tc], board, snakeQueue });
		}
	}

	returnArrow = (movement) => {
		if (movement === arrow.UP) {
			return '^';
		} else if (movement === arrow.DOWN) {
			return 'v';
		} else if (movement === arrow.LEFT) {
			return '<';
		} else if (movement === arrow.RIGHT) {
			return '>';
		}
	}


	render() {
		return (
			<div className="App">
				<Container>
					<Navbar fixed="top" expand="lg" bg="light">
						<Jumbotron className="jumbo"> Array Snake </Jumbotron>
						<Sliders className="navButton" onClick={() => this.setState({ sizeModal: true })} />
						<a href='https://github.com/harsha218/ArraySnake' target='_blank'><img className="navIcon" src={git} alt="github link"/></a>
					</Navbar>
				</Container>
				{this.state.gameover &&
					<div className="App-header">
						<Card style={{ width: '18rem' }}>
							<Card.Body>
								<Card.Text>
									{this.state.outcome}
								</Card.Text>
								<Card.Text>
									Score: {this.state.snakeLength}
								</Card.Text>
								<Button variant="primary" autoFocus={true} onClick={this.makeBoard}>Try Again!!!</Button>
							</Card.Body>
						</Card>
					</div>}
				{this.state.sizeModal &&
					<div className="App-header">
						<Card style={{ width: '18rem' }}>
							<Card.Body>
								<Card.Text>
									Size of your Board
								<input type="number" value={this.state.size} onChange={(e) => {
										let s = e.target.value;
										if (s <= 30) {
											this.setState({ size: s });
										}
									}} />{' '}
								</Card.Text>
								<Card.Text>
									Speed of the Snake(ms)
								<input type="number" value={this.state.interval} onChange={(e) => {
										let s = e.target.value;
										if (s <= 1000) {
											this.setState({ interval: s });
										}
									}} />{' '}
								</Card.Text>
								<Button variant="primary" size="lg" onClick={() => {
									this.setState({ size: 10, interval: 400 });
								}}>Reset</Button>
								<Button variant="primary" size="lg" onClick={this.makeBoard}>Done</Button>
							</Card.Body>
						</Card>
					</div>}
				{!this.state.sizeModal && !this.state.scoreModel &&
					<div className="App-header">
						<Table striped bordered hover>
							<tbody>
								{this.state.board.length ? this.state.board.map((row, i) =>
									<tr key={i}>
										{row.map((col, j) =>
											<td key={j} style={{ width: '2em' }}>&nbsp;&nbsp;{col}&nbsp;&nbsp;</td>
										)}
									</tr>
								) : null}
							</tbody>
						</Table>
					</div>}
			</div>
		);
	}
}

export default App;
