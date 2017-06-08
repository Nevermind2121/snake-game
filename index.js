const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const widthUnit = 10
const heightUnit = 10
let direction = 'right'

let snakeBody = [{'x': 0, 'y': 0}, {'x': 10, 'y': 0}, {'x': 20, 'y': 0}, {'x': 30, 'y': 0}]
let food = {}
let badFood = []

function curryFillRect(x, y) {
	ctx.fillRect(x, y, widthUnit, heightUnit)
}

function checkCollision(point, secondPoint) {
	if (point.x === secondPoint.x && point.y === secondPoint.y) return true
	return false
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw () {
	ctx.fillStyle = 'grey'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.fillStyle = 'green'
	snakeBody.forEach((cell)=> curryFillRect(cell.x, cell.y))

	ctx.fillStyle = 'red'
	curryFillRect(food.x, food.y)

	if (badFood.length) {
		ctx.fillStyle = 'purple'
		badFood.forEach((badFood)=> curryFillRect(badFood.x, badFood.y))
	}
	
}

function generateFood() {
	let randomCoords = {x: getRandomInt(0, canvas.width/10-1) * 10, y: getRandomInt(0, canvas.height/10-1) * 10}
	let matches = snakeBody.filter((snakeCell) => checkCollision(snakeCell, randomCoords))
	if (matches.length) return generateFood()
	return randomCoords
}

function generateBadFood() {
	badFoodCandidate = generateFood()
	if (checkCollision(badFoodCandidate, food)) return generateBadFood()
	return badFoodCandidate
}

food = generateFood()
badFood.push(generateBadFood())
badFood.push(generateBadFood())
badFood.push(generateBadFood())
draw()

function easyDifficulty() {
	snakeBody.shift()
	const lastCell = snakeBody[snakeBody.length - 1]
	let newCell = null
	if (direction === 'right') {
		let newX = lastCell.x+widthUnit
		if (newX === canvas.width) newX = 0
		newCell = {'x': newX, 'y': lastCell.y}
	}
	if (direction === 'left') {
		let newX = lastCell.x-widthUnit
		if (newX < 0) newX = canvas.width
		newCell = {'x': newX, 'y': lastCell.y}
	}
	if (direction === 'up') {
		let newY = lastCell.y-heightUnit
		if (newY < 0) newY = canvas.height
		newCell = {'x': lastCell.x, 'y': newY}
	}
	if (direction === 'down') {
		let newY = lastCell.y+heightUnit
		if (newY === canvas.height) newY = 0
		newCell = {'x': lastCell.x, 'y': newY}
	}

	snakeBody.forEach((snakeCell)=> {
		if (checkCollision(snakeCell, newCell)) clearInterval(gameLoop)
	})

	snakeBody.push(newCell)
	if (checkCollision(food, newCell)) {
		snakeBody.push({x: food.x, y: food.y})
		food = generateFood()
	}
}

function mediumDifficulty() {
	snakeBody.shift()
	const lastCell = snakeBody[snakeBody.length - 1]
	let newCell = null
	if (direction === 'right') {
		let newX = lastCell.x+widthUnit
		if (newX === canvas.width) clearInterval(gameLoop)
		newCell = {'x': newX, 'y': lastCell.y}
	}
	if (direction === 'left') {
		let newX = lastCell.x-widthUnit
		if (newX < 0) clearInterval(gameLoop)
		newCell = {'x': newX, 'y': lastCell.y}
	}
	if (direction === 'up') {
		let newY = lastCell.y-heightUnit
		if (newY < 0) clearInterval(gameLoop)
		newCell = {'x': lastCell.x, 'y': newY}
	}
	if (direction === 'down') {
		let newY = lastCell.y+heightUnit
		if (newY === canvas.height) clearInterval(gameLoop)
		newCell = {'x': lastCell.x, 'y': newY}
	}

	snakeBody.forEach((snakeCell)=> {
		if (checkCollision(snakeCell, newCell)) clearInterval(gameLoop)
	})

	snakeBody.push(newCell)
	if (checkCollision(food, newCell)) {
		snakeBody.push({x: food.x, y: food.y})
		food = generateFood()
	}
}

let counterForBadFood = 0
function hardDifficulty() {
	counterForBadFood += 1
	snakeBody.shift()
	const lastCell = snakeBody[snakeBody.length - 1]
	let newCell = null
	if (direction === 'right') {
		let newX = lastCell.x+widthUnit
		if (newX === canvas.width) clearInterval(gameLoop)
		newCell = {'x': newX, 'y': lastCell.y}
	}
	if (direction === 'left') {
		let newX = lastCell.x-widthUnit
		if (newX < 0) clearInterval(gameLoop)
		newCell = {'x': newX, 'y': lastCell.y}
	}
	if (direction === 'up') {
		let newY = lastCell.y-heightUnit
		if (newY < 0) clearInterval(gameLoop)
		newCell = {'x': lastCell.x, 'y': newY}
	}
	if (direction === 'down') {
		let newY = lastCell.y+heightUnit
		if (newY === canvas.height) clearInterval(gameLoop)
		newCell = {'x': lastCell.x, 'y': newY}
	}

	snakeBody.forEach((snakeCell)=> {
		if (checkCollision(snakeCell, newCell)) clearInterval(gameLoop)
	})

	snakeBody.push(newCell)
	if (checkCollision(food, newCell)) {
		snakeBody.push({x: food.x, y: food.y})
		food = generateFood()
	}

	var badFoodCollision = false
	badFood.forEach((badFood)=> {
		if (checkCollision(badFood, newCell)) {
			snakeBody.shift()
			badFoodCollision = true
			if (snakeBody.length == 1) clearInterval(gameLoop)
		}
	})

	if (badFoodCollision) badFood.push(generateBadFood())

	if (counterForBadFood === 15) {
		counterForBadFood = 0
		badFood.shift()
		badFood.shift()
		badFood.shift()
		badFood.push(generateBadFood())
		badFood.push(generateBadFood())
		badFood.push(generateBadFood())
	}
}

let gameLoop = setInterval(()=> {
	hardDifficulty()
	draw()
}, 150)

document.addEventListener('keydown', (e) => {
	if ((e.code === 'ArrowDown' || e.code === 'KeyS') && direction !== 'up') direction = 'down'
	if ((e.code === 'ArrowUp' || e.code === 'KeyW') && direction !== 'down') direction = 'up'
	if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && direction !== 'right') direction = 'left'
	if ((e.code === 'ArrowRight' || e.code === 'KeyD') && direction !== 'left') direction = 'right'
})


