pragma solidity ^0.4.11;

contract Casino {
    address owner;

    uint public minimumBet;
    uint public totalBet;
    uint public numberOfBets;
    uint public maxAmountOfBets = 5;
    uint public minBetValue = 1;
    uint public maxBetValue = 5;
    address[] players;

    struct Player {
        uint amountBet;
        uint numberSelected;
    }

    mapping(address => Player) public playerInfo;

    function Casino(uint _minimumBet, uint _maxAmountOfBets) public {
        owner = msg.sender;

        if (_minimumBet != 0)
            minimumBet = _minimumBet;

        if (_maxAmountOfBets != 0)
            maxAmountOfBets = _maxAmountOfBets;
    }

    function bet(uint _guess) payable public {
        require(isNewPlayer(msg.sender) == true);
        require(_guess >= 1 && _guess <= 5);
        require(msg.value >= minimumBet);

        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].numberSelected = _guess;
        numberOfBets += 1;
        players.push(msg.sender);
        totalBet += msg.value;

        if (numberOfBets >= maxAmountOfBets)
            generateNumberWinner();
    }

    // function allNumbersOccupied() private constant returns (bool) {
    //     uint[10] memory occupiedNumbers;

    //     for (uint i = 0; i < players.length; i++) {
    //         occupiedNumbers[i] = players[i].numberSelected;
    //     }
    // }

    function isNewPlayer(address _player) private constant returns(bool) {
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == _player)
                return false;
        }

        return true;
    }

    function generateNumberWinner() private {
        uint numberGenerated = block.number % 5 + 1;

        distributePrizes(numberGenerated);
    }

    function distributePrizes(uint _winningNumber) private {
        address[100] memory winners;
        uint count = 0;

        for (uint i = 0; i < players.length; i++) {
            address playerAddress = players[i];
            if (playerInfo[playerAddress].numberSelected == _winningNumber) {
                winners[count] = playerAddress;
                count++;
            }
            delete playerInfo[playerAddress];
        }

        uint winnerEtherAmount = totalBet / count;

        for (uint j = 0; j < count; j++) {
            if (winners[j] != address(0)) {
                winners[j].transfer(winnerEtherAmount);
            }
        }

        resetData();
    }

    function resetData() private {
        players.length = 0;
        totalBet = 0;
        numberOfBets = 0;
    }

    function kill() public {
        require(msg.sender == owner);

        selfdestruct(owner);
    }

    function () payable public {}
}
