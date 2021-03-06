const Page = {
    ELEMENT_ID: {
        NODES: {
            NODE: 'select-node',
            ADD_NODE_GROUP: 'add-node-group',
            ADD_NODE_SHOW_BUTTON: 'add-node-button',
            REMOVE_NODE_BUTTON: 'remove-node-button',
            NAME: 'select-node-name',
            URL: 'select-node-url',
            CHAIN_ID: 'select-node-chain-id',
            ADD: 'select-node-add',
            CANCEL: 'select-node-cancel',
            ADD_ERROR: 'add-node-error',
            NODE_ERROR: 'node-error'
        },
        BALANCE: {
            WALLET_FORM_GROUP: 'wallet-form-group',
            WALLET_INPUT: 'wallet-input',
            CHECK_BUTTON: 'wallet-button',
            CONTAINER: 'balance-container',
            TOKENS: 'balance-tokens',
            ETH: 'balance-eth',
            BTC: 'balance-btc',
            WITHDRAWALS_ETH: 'balance-withdrawals-eth',
            WAIT: 'balance-wait',
            ERROR: 'balance-error'
        },
        TOKENS_HISTORY: {
            TEMPLATE: 'tokens-history-template',
            OPERATION: {
                TIME: 'tokens-history-op-time',
                NAME_BUY: 'tokens-history-op-name-buy',
                NAME_SELL: 'tokens-history-op-name-sell',
                COUNT: 'tokens-history-op-count'
            },
            CONTAINER: 'tokens-history-container',
            CONTENT: 'tokens-history-content'
        },
        CHART: {
            ID: 'chart',
            BUTTONS: {
                WHOLE: 'chart-whole',
                MONTH: 'chart-month'
            }
        },
        ALTER_WALLET: {
            PRIVATE_KEY: {
                GROUP: 'add-wallet-private-key-group',
                KEY: 'add-wallet-private-key',
                BUTTON: 'add-wallet-private-key-button',
                WAIT: 'add-wallet-private-key-wait',
                ERROR: 'add-wallet-private-key-error'
            },
            FILE: {
                GROUP: 'add-wallet-file-group',
                FILE: 'add-wallet-file',
                PASSWORD: 'add-wallet-file-password',
                BUTTON: 'add-wallet-file-button',
                WAIT: 'add-wallet-file-wait',
                ERROR: 'add-wallet-file-error'
            },
            OPERATIONS: {
                CONTAINER: 'wallet-ops',
                WALLET_ADDRESS: 'wallet-address',
                BUY: {
                    GROUP: 'buy-tokens-group',
                    COUNT: 'buy-tokens-count',
                    GAS_PRICE: 'buy-gas-price',
                    BUTTON: 'buy-tokens-button',
                    PRICE: 'buy-tokens-price',
                    WAIT: 'buy-tokens-wait',
                    ERROR: 'buy-tokens-error',
                    TRANSACTION_WAIT: 'buy-tokens-transaction-waiting',
                    TRANSACTION_COMPLETE: 'buy-tokens-transaction-completed',
                    TRANSACTION_FAILED: 'buy-tokens-transaction-failed'
                },
                SELL: {
                    GROUP: 'sell-tokens-group',
                    COUNT: 'sell-tokens-count',
                    WALLET: 'sell-tokens-wallet',
                    BUTTON: 'sell-tokens-button',
                    PRICE: 'sell-tokens-price',
                    WAIT: 'sell-tokens-wait',
                    ERROR: 'sell-tokens-error',
                    TRANSACTION_WAIT: 'sell-tokens-transaction-waiting',
                    TRANSACTION_COMPLETE: 'sell-tokens-transaction-completed',
                    TRANSACTION_FAILED: 'buy-tokens-transaction-failed'
                }
            },
            INFO: {
                BALANCE: 'alter-wallet-balance',
                WITHDRAWALS: 'alter-wallet-withdrawals',
                PRICE: 'alter-wallet-token-price',
                CAN_BE_BOUGHT: 'alter-wallet-tokens-can-be-bought',
                TOKENS_LEFT: 'alter-wallet-tokens-left',
                WALLET_TOKENS: 'alter-wallet-tokens'
            }
        }
    },
    $id(id) {
        return $(`#${id}`);
    },
    setNodes(nodesNames, currentId, canRemove) {
        $.each(nodesNames, (i, {id, name}) => {
            Page.appendNode(id, name);
        });
        Page.selectNode(currentId);
        Page.nodesState.disableRemoveNode(!canRemove);
    },
    appendNode(value, name) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE)
            .append($('<option></option>')
                .attr("value", value)
                .text(name));
    },
    removeNode(value) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE)
            .find(`[value="${value}"]`)
            .remove();
    },
    showWalletValid(isValid) {
        Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_FORM_GROUP).toggleClass('has-error', !isValid);
        Page.$id(Page.ELEMENT_ID.BALANCE.CHECK_BUTTON).prop('disabled', !isValid);
    },
    showBalanceWait(show) {
        Page.$id(Page.ELEMENT_ID.BALANCE.WAIT).toggle(show);
    },
    showAlterWalletPrivateKeyWait(isWaiting) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
    },
    showAlterWalletFileWait(isWaiting) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
    },
    showBalance(tokens, eth, btc, withdrawals) {

        function strNull(s) {
            return s == null ? '...' : s;
        }

        Page.$id(Page.ELEMENT_ID.BALANCE.CONTAINER).css('visibility', tokens == null ? 'hidden' : 'visible');
        Page.$id(Page.ELEMENT_ID.BALANCE.TOKENS).text(strNull(tokens));
        Page.$id(Page.ELEMENT_ID.BALANCE.ETH).text(strNull(eth));
        Page.$id(Page.ELEMENT_ID.BALANCE.BTC).text(strNull(btc));
        Page.$id(Page.ELEMENT_ID.BALANCE.WITHDRAWALS_ETH).text(strNull(withdrawals));
    },
    showTokensHistory(walletId, res) {
        Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.CONTAINER).css('visibility', res == null ? 'hidden' : 'visible');

        const $template = Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.TEMPLATE);

        function addElementIdKey($el, key) {
            const newId = $el[0].id + '-' + key;
            $el.prop('id', newId);
        }

        function setElementContent($el, key, text) {
            addElementIdKey($el, key);
            $el.text(text);
        }

        function setElementIdContent($parent, elId, key, text) {
            const $el = $parent.find(`#${elId}`);
            setElementContent($el, key, text);
        }

        function toggleElementId($parent, elId, key, show) {
            const $el = $parent.find(`#${elId}`);
            addElementIdKey($el, key);
            $el.toggle(show);
        }

        const $rows = res && res.map((item, index) => {
            const $el = $template.clone().show();
            addElementIdKey($el, index);
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.TIME, index, moment(item.timestamp * 1000).format('DD.MM.YY HH:mm:ss'));
            const isBuy = walletId.toLowerCase() === item.to.toLowerCase();
            toggleElementId($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.NAME_BUY, index, isBuy);
            toggleElementId($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.NAME_SELL, index, !isBuy);
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.COUNT, index, item.count);
            return $el;
        });
        const $container = Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.CONTENT).empty();
        if ($rows) {
            $container.append($rows);
        }
    },
    showAddNodeValid(nameValid, urlValid, chainIdValid) {
        const allValid = nameValid && urlValid && chainIdValid;
        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_GROUP).toggleClass('has-error', !allValid);
        Page.$id(Page.ELEMENT_ID.NODES.ADD).prop('disabled', !allValid);
        Page.$id(Page.ELEMENT_ID.NODES.NAME).toggleClass('alert-danger', !nameValid);
        Page.$id(Page.ELEMENT_ID.NODES.URL).toggleClass('alert-danger', !urlValid);
        Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).toggleClass('alert-danger', !chainIdValid);
    },
    showNodeError(error) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE_ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAddNodeError(error) {
        Page.$id(Page.ELEMENT_ID.NODES.ADD_ERROR)
            .text(error)
            .toggle(error != null);
    },
    selectNode(valueToSelect) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE).val(valueToSelect);
    },
    getSelectedNode() {
        return Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
    },
    showBalanceError(error) {
        Page.$id(Page.ELEMENT_ID.BALANCE.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletPrivateKeyError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletFileError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showBuyTokensError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showSellTokensError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletValid(keyValid, fileValid, filePasswordValid) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.GROUP).toggleClass('has-error', !keyValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).prop('disabled', !keyValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.GROUP).toggleClass('has-error', !fileValid || !filePasswordValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).prop('disabled', !fileValid || !filePasswordValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE).toggleClass('alert-danger', !fileValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASSWORD).toggleClass('alert-danger', !filePasswordValid);
    },
    showCurrentWallet(walletInfo) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.CONTAINER).toggle(!!walletInfo);
        if (!walletInfo) {
            return;
        }
        const {wallet, info, gasPrice} = walletInfo;
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.WALLET_ADDRESS).text(wallet.address);
        const INFO_IDS = Page.ELEMENT_ID.ALTER_WALLET.INFO;
        Page.$id(INFO_IDS.BALANCE).text(info.balance);
        Page.$id(INFO_IDS.WITHDRAWALS).text(info.withdrawals);
        Page.$id(INFO_IDS.PRICE).text(info.price);
        Page.$id(INFO_IDS.CAN_BE_BOUGHT).text(info.canBeBought);
        Page.$id(INFO_IDS.TOKENS_LEFT).text(info.tokensLeft);
        Page.$id(INFO_IDS.WALLET_TOKENS).text(info.walletTokens);

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.GAS_PRICE).val(gasPrice);
    },
    buyTokensState: {
        _isValid: false,
        _isWaiting: false,
        _showCurrentState() {
            const isValid = Page.buyTokensState._isValid;
            const isWaiting = Page.buyTokensState._isWaiting;
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.GROUP).toggleClass('has-error', !isValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.GAS_PRICE).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.BUTTON).prop('disabled', !isValid || isWaiting);
        },
        init() {
            Page.buyTokensState._isValid = false;
            Page.buyTokensState._isWaiting = false;
            Page.buyTokensState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.buyTokensState._isWaiting = isWait;
            Page.buyTokensState._showCurrentState();
        },
        toggleValid(isValid) {
            Page.buyTokensState._isValid = isValid;
            Page.buyTokensState._showCurrentState();
        }
    },
    sellTokensState: {
        _isCountValid: false,
        _isRecipientValid: false,
        _isWaiting: false,
        _showCurrentState() {
            const isCountValid = Page.sellTokensState._isCountValid;
            const isRecipientValid = Page.sellTokensState._isRecipientValid;
            const isWaiting = Page.sellTokensState._isWaiting;
            const isGroupValid = isCountValid && isRecipientValid;
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.GROUP).toggleClass('has-error', !isGroupValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).toggleClass('alert-danger', !isCountValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).toggleClass('alert-danger', !isRecipientValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.BUTTON).prop('disabled', !isCountValid || !isRecipientValid || isWaiting);
        },
        init() {
            Page.sellTokensState._isCountValid = false;
            Page.sellTokensState._isRecipientValid = false;
            Page.sellTokensState._isWaiting = false;
            Page.sellTokensState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.sellTokensState._isWaiting = isWait;
            Page.sellTokensState._showCurrentState();
        },
        toggleValid(isCountValid, isRecipientValid) {
            Page.sellTokensState._isCountValid = isCountValid;
            Page.sellTokensState._isRecipientValid = isRecipientValid;
            Page.sellTokensState._showCurrentState();
        }
    },
    showBuyTokensPrice(price) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.PRICE).text(price);
    },
    showSellTokensPrice(price) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.PRICE).text(price);
    },
    showTransaction(ids, id, complete, fail) {
        const $wait = Page.$id(ids.TRANSACTION_WAIT);
        const $complete = Page.$id(ids.TRANSACTION_COMPLETE);
        const $failed = Page.$id(ids.TRANSACTION_FAILED);
        $wait.hide();
        $complete.hide();
        $failed.hide();
        if (id == null) {
            return;
        }
        const $caption = complete ?
            fail ?
                $failed :
                $complete :
            $wait;
        const templateText = $caption.data('template');
        const text = templateText.replace('%', id);
        $caption.text(text).show();
    },
    showBuyTransaction(id, complete, fail) {
        Page.showTransaction(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY, id, complete, fail);
    },
    showSellTransaction(id, complete, fail) {
        Page.showTransaction(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL, id, complete, fail);
    },
    getChartCanvasElement() {
        return Page.$id(Page.ELEMENT_ID.CHART.ID)[0];
    },
    nodesState: {
        _disableRemove: false,
        _nodeAdding: false,
        _showCurrentState() {
            const disableRemove = Page.nodesState._disableRemove;
            const nodeAdding = Page.nodesState._nodeAdding;
            Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).prop('disabled', disableRemove || nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_GROUP).toggle(nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).prop('disabled', nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.NODE).prop('disabled', nodeAdding);
        },
        init() {
            Page.nodesState._showCurrentState();
        },
        disableRemoveNode(disable) {
            Page.nodesState._disableRemove = disable;
            Page.nodesState._showCurrentState();
        },
        toggleNodeAdding(adding) {
            Page.nodesState._nodeAdding = adding;
            Page.nodesState._showCurrentState();
        }
    },
    init() {
        Page.showNodeError();
        Page.showAddNodeError();
        Page.showBalanceError();
        Page.showBalance();
        Page.showTokensHistory();
        Page.showBalanceWait(false);
        Page.showAlterWalletPrivateKeyWait(false);
        Page.showAlterWalletFileWait(false);
        Page.showCurrentWallet();
        Page.showAlterWalletPrivateKeyError();
        Page.showAlterWalletFileError();
        Page.showBuyTokensError();
        Page.showSellTokensError();
        Page.showBuyTransaction();
        Page.showSellTransaction();

        Page.buyTokensState.init();
        Page.sellTokensState.init();
        Page.nodesState.init();

        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).click(() => {
            Page.nodesState.toggleNodeAdding(true);
            Page.showNodeError();
            Page.showAddNodeError();
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.CANCEL).click(() => {
            Page.nodesState.toggleNodeAdding(false);
            Page.showNodeError();
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.ADD).click(() => {
            Page.showAddNodeError();
            Page.showNodeError();
            try {
                const name = Page.$id(Page.ELEMENT_ID.NODES.NAME).val();
                const url = Page.$id(Page.ELEMENT_ID.NODES.URL).val();
                const chainId = Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val();
                const {id, node, canRemoveNode} = Page.onNodeAdd({name, url, chainId});
                Page.appendNode(id, node.name);
                Page.selectNode(id);
                Page.nodesState.toggleNodeAdding(false);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
            }
            catch (e) {
                Page.showAddNodeError(e);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).click(() => {
            Page.showNodeError();
            const curNodeId = Page.getSelectedNode();
            try {
                const {id, canRemoveNode} = Page.onNodeRemove(curNodeId);
                Page.removeNode(curNodeId);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
                Page.selectNode(id);
            } catch (e) {
                Page.showNodeError(e);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.NODE).change(() => {
            Page.showNodeError();
            const currentNodeId = Page.getSelectedNode();
            try {
                const canRemoveNode = Page.onNodeChange(currentNodeId);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
            }
            catch (e) {
                Page.showNodeError(e);
            }
        });

        Page.$id(Page.ELEMENT_ID.BALANCE.CHECK_BUTTON).click(() => {
            Page.showBalanceWait(true);
            Page.showBalanceError();
            const walletId = Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_INPUT).val();

            function handleError(err/*, isThrown*/) {
                Page.showBalanceWait(false);
                Page.showBalanceError(err);
                Page.showBalance();
                Page.showTokensHistory();
            }

            function handleResult({balance, tokens}) {
                Page.showBalanceWait(false);
                Page.showBalance(balance.tokens, balance.eth, balance.btc, balance.withdrawals);
                Page.showTokensHistory(walletId, tokens);
            }

            try {
                Page.onBalanceCheckAsync(walletId)
                    .then(({balance, tokens}) => {
                        handleResult({balance, tokens});
                    })
                    .catch((err) => {
                        handleError(err, false);
                    });
            }
            catch (e) {
                handleError(e, true);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).click(() => {
            Page.showCurrentWallet();
            Page.showAlterWalletPrivateKeyError();
            Page.showAlterWalletFileError();
            Page.showAlterWalletPrivateKeyWait(true);
            const privateKey = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val();
            const privateKey0x = /^0x/.test(privateKey) ? privateKey : `0x${privateKey}`;
            try {
                Page.onAlterWalletPrivateKeyAsync(privateKey0x)
                    .then((walletInfo) => {
                        Page.showCurrentWallet(walletInfo);
                        Page.showAlterWalletPrivateKeyWait(false);
                    })
                    .catch((err) => {
                        Page.showAlterWalletPrivateKeyError(err);
                        Page.showAlterWalletPrivateKeyWait(false);
                    });
            }
            catch (e) {
                Page.showAlterWalletPrivateKeyError(e);
                Page.showAlterWalletPrivateKeyWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).click(() => {
            Page.showCurrentWallet();
            Page.showAlterWalletPrivateKeyError();
            Page.showAlterWalletFileError();
            Page.showAlterWalletFileWait(true);
            const file = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0];
            const password = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASSWORD).val();
            try {
                Page.onAlterWalletFileAsync(file, password)
                    .then((walletInfo) => {
                        Page.showCurrentWallet(walletInfo);
                        Page.showAlterWalletFileWait(false);
                    })
                    .catch((err) => {
                        Page.showAlterWalletFileError(err);
                        Page.showAlterWalletFileWait(false);
                    });
            }
            catch (e) {
                Page.showAlterWalletFileError(e);
                Page.showAlterWalletFileWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.BUTTON).click(() => {
            Page.showBuyTokensError();
            Page.showBuyTransaction();
            Page.buyTokensState.toggleWait(true);
            const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).val();
            const gasPrice = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.GAS_PRICE).val();
            try {
                let transactionId;
                function onTransactionId(id) {
                    transactionId = id;
                    Page.showBuyTransaction(id, false);
                }

                Page.onBuyTokensAsync(count, gasPrice, onTransactionId)
                    .then(() => {
                        Page.buyTokensState.toggleWait(false);
                        Page.showBuyTransaction(transactionId, true);
                    })
                    .catch((err) => {
                        Page.showBuyTokensError(err);
                        Page.buyTokensState.toggleWait(false);
                        Page.showBuyTransaction(transactionId, true, true);
                    })
            }
            catch (e) {
                Page.showBuyTokensError(e);
                Page.buyTokensState.toggleWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.BUTTON).click(() => {
            Page.showSellTokensError();
            Page.showSellTransaction();
            Page.sellTokensState.toggleWait(true);
            const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).val();
            const walletId = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).val();
            try {
                let transactionId;
                function onTransactionId(id) {
                    transactionId = id;
                    Page.showSellTransaction(id, false);
                }

                Page.onSellTokensAsync(count, walletId, onTransactionId)
                    .then(() => {
                        Page.sellTokensState.toggleWait(false);
                        Page.showSellTransaction(transactionId, true);
                    })
                    .catch((err) => {
                        Page.showSellTokensError(err);
                        Page.sellTokensState.toggleWait(false);
                        Page.showSellTransaction(transactionId, true, true);
                    })
            }
            catch (e) {
                Page.showSellTokensError(e);
                Page.sellTokensState.toggleWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.CHART.BUTTONS.WHOLE).click(() => {
            Page.onChartShowWhole();
            return false;
        });
        Page.$id(Page.ELEMENT_ID.CHART.BUTTONS.MONTH).click(() => {
            Page.onChartShowMonth();
            return false;
        });

        // Add node validation >>>

        Page.showAddNodeValid(false);
        function calcAndShowAddNodeValid() {
            const {nameValid, urlValid, chainIdValid} = Page.onAddNodeValidation(
                Page.$id(Page.ELEMENT_ID.NODES.NAME).val(),
                Page.$id(Page.ELEMENT_ID.NODES.URL).val(),
                Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val()
            );
            Page.showAddNodeValid(nameValid, urlValid, chainIdValid);
        }

        Page.$id(Page.ELEMENT_ID.NODES.NAME).on('input', () => {
            calcAndShowAddNodeValid();
        });

        Page.$id(Page.ELEMENT_ID.NODES.URL).on('input', () => {
            calcAndShowAddNodeValid();
        });

        Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).on('input', () => {
            calcAndShowAddNodeValid();
        });

        // <<< Add node validation

        // Wallet validation >>>

        Page.showWalletValid(false);

        Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_INPUT).on('input', (evt) => {
            Page.showWalletValid(
                Page.onBalanceWalletValidation(evt.target.value)
            );
        });

        // <<< Wallet validation

        // Alter wallet validation >>>

        Page.showAlterWalletValid(false, false, true);
        function showCurrentAlterWalletValid() {
            const {keyValid, fileValid} = Page.onAlterWalletValidation(
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val(),
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0]
            );
            Page.showAlterWalletValid(keyValid, fileValid, true);
        }

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).on('input', () => {
            showCurrentAlterWalletValid();
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE).on('change', () => {
            showCurrentAlterWalletValid();
        });

        // <<< Alter wallet validation

        // Buy tokens validation >>>

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).on('input', (evt) => {
            Page.buyTokensState.toggleValid(
                Page.onBuyTokensValidation(evt.target.value)
            );
        });

        // <<< Buy tokens validation

        // Sell tokens validation >>>

        function showCurrentSellTokensValid() {
            const {countValid, recipientValid} = Page.onSellTokensValidation(
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).val(),
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).val()
            );
            Page.sellTokensState.toggleValid(countValid, recipientValid);
        }

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).on('input', () => {
            showCurrentSellTokensValid();
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).on('input', () => {
            showCurrentSellTokensValid();
        });

        // <<< Sell tokens validation

    },
    onNodeAdd() {},
    onNodeRemove() {},
    onNodeChange() {},
    onBalanceCheckAsync() {},
    onAlterWalletPrivateKeyAsync() {},
    onAlterWalletFileAsync() {},
    onBuyTokensAsync() {},
    onSellTokensAsync() {},
    onAddNodeValidation() {},
    onBalanceWalletValidation() {},
    onAlterWalletValidation() {},
    onBuyTokensValidation() {},
    onSellTokensValidation() {},
    onChartShowWhole() {},
    onChartShowMonth() {}
};
