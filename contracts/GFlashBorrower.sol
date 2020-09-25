// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.6.0;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

import { G } from "./G.sol";

import { FlashLoanReceiver } from "./interop/Aave.sol";

import { $ } from "./network/$.sol";

abstract contract GFlashBorrower is FlashLoanReceiver
{
	using SafeMath for uint256;

	uint256 private allowOperationLevel = 0;

	modifier mayFlashBorrow()
	{
		allowOperationLevel++;
		_;
		allowOperationLevel--;
	}

	function executeOperation(address _token, uint256 _amount, uint256 _fee, bytes calldata _params) external override
	{
		assert(allowOperationLevel > 0);
		address _from = msg.sender;
		address _pool = $.AAVE_LENDING_POOL;
		assert(_from == _pool);
		require(_processFlashLoan(_token, _amount, _fee, _params), "failure processing flash loan");
		uint256 _grossAmount = _amount.add(_fee);
		G.paybackFlashLoan(_token, _grossAmount);
	}

	function _processFlashLoan(address _token, uint256 _amount, uint256 _fee, bytes calldata _params) internal virtual returns (bool _success);
}
