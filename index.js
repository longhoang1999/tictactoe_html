$(document).ready(function () {
    const $boardElement = $(".board")
    const $messageElement = $("#message")
    const $resetElement = $("#reset")

    const boardSize = 10
    const winCondition = 5
    let currentPlayer = "X"
    let gameOver = false
    let board = []

    function initBoard() {
        board = []
        for (let i = 0; i < boardSize; i++) {
            board[i] = []
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = null
            }
        }
        console.log(board);
    }

    function createBoard() {
        $boardElement.empty();
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const $cell = $("<div>")
                    .attr('data-row', i)
                    .attr('data-col', j)
                    .click(function () {
                        handleMove(i, j)
                    })
                $boardElement.append($cell)
            }
        }
    }

    function handleMove(row, col) {
        if (board[row][col] !== null || gameOver) return

        board[row][col] = currentPlayer
        const $cell = $boardElement.find(`[data-row=${row}][data-col=${col}]`)
        $cell.text(currentPlayer)
        $cell.css('color', currentPlayer == "X" ? "red" : "blue")


        if (checkWin(row, col)) {
            $messageElement.text(`Người chơi ${currentPlayer} chiến thắng`)
            gameOver = true
            return
        }


        currentPlayer = currentPlayer == "X" ? "O" : "X"
        $messageElement.text(`Lượt chơi của người chơi ${currentPlayer}`)
    }

    function checkWin(row, col) {
        const directions = [
            {
                // Hàng dọc
                rowDir: 1,
                colDir: 0
            }, {
                // Hàng ngang
                rowDir: 0,
                colDir: 1
            }, {
                // Chéo \
                rowDir: 1,
                colDir: 1
            }, {
                // Chéo /
                rowDir: 1,
                colDir: -1
            }
        ]

        for (let { rowDir, colDir } of directions) {
            const cells = checkDirection(row, col, rowDir, colDir)
            if (cells.length >= winCondition) {
                highlightCell(cells)
                return true
            }
        }

        return false
    }

    function checkDirection(row, col, rowDir, colDir) {
        // danh sách các ô liền nhau liên tiếp
        const cells = [{ row, col }]
        for (let i = 1; i < winCondition; i++) {
            if (board[row + i * rowDir]?.[col + i * colDir] == currentPlayer) {
                cells.push({
                    row: row + i * rowDir,
                    col: col + i * colDir
                })
            } else break
        }

        for (let i = 1; i < winCondition; i++) {
            if (board[row - i * rowDir]?.[col - i * colDir] == currentPlayer) {
                cells.push({
                    row: row - i * rowDir,
                    col: col - i * colDir
                })
            } else break
        }
        return cells
    }

    function highlightCell(cells) {
        cells.forEach(function ({ row, col }) {
            $boardElement.find(`[data-row=${row}][data-col=${col}]`)
                .css('backgroundColor', 'lightgreen')

        })
    }
    function resetGame() {
        initBoard()
        currentPlayer = "X"
        gameOver = false
        $messageElement.text(`Lượt chơi của người chơi ${currentPlayer}`)
        createBoard()
    }

    $resetElement.click(resetGame)

    initBoard() // Tạo mảng board 2 chiều với các giá trị null
    createBoard() // render bàn cờ sang html
})