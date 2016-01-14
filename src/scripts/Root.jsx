"use strict"

import React from 'react'
import moment from 'moment'
import update from 'react-addons-update'

import {newExpense, deleteExpense, newCategory} from './action-creators.js'

import NumberInput from './NumberInput.jsx'
import EditExpense from './EditExpense.jsx'
import TabsContainer from './TabsContainer.jsx'
import WaitIndicator from './WaitIndicator.jsx'
import History from './History.jsx'
import Statistics from './Statistics.jsx'
import Settings from './Settings'

const Root = React.createClass({

    getInitialState: function() {
        return {
            activeTab: "Settings"
        }
    },

    componentDidMount: function() {
        this.unsubscribe = this.context.store.subscribe(() => {
            this.forceUpdate()
        })
    },

    componentUnmount: function() {
        this.unsubscribe();
    },

    onAdd: function(attrs) {
        this.context.store.dispatch(newExpense(attrs))
    },

    onAddCategory: function(attrs) {
        this.context.store.dispatch(newCategory(attrs))
    },

    onDelete: function(id) {
        this.context.store.dispatch(deleteExpense(id))
    },

    onSwitchTab: function(newActiveTab) {
        this.setState(update(this.state, {
            activeTab: {$set: newActiveTab}
        }))
    },

    render: function () {
        const {store} = this.context
        const {error, history, categoryList, waiting} = store.getState()

        let input;
        let prevValue = 0;

        if(error === "UNAUTHORIZED") {
            return (
                <h1>To use application you should be <a href="/login">authorized in Google</a></h1>
            )
        }
        else {
            return (
                <div>
                    <TabsContainer titleList={["Main", "History", "Statistics", "Settings"]}
                                   active={this.state.activeTab}
                                   onSwitch={this.onSwitchTab}>
                        <div>
                            <EditExpense onAdd={this.onAdd}/>
                        </div>

                        <div>
                            <History onDelete={this.onDelete}/>
                        </div>

                        <div>
                            <Statistics />
                        </div>

                        <div>
                            <Settings />
                        </div>

                    </TabsContainer>
                    <WaitIndicator waiting={waiting}/>
                </div>
            )
        }
    }
})

Root.contextTypes = {
    store: React.PropTypes.object
}

export default Root
