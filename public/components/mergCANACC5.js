

Vue.component('merg-canacc5', {
    name: "merg-canacc5",
    data: function () {
        return {
            nodeId: 0,
            headers: [
                {text: 'id', value: 'id'},
                {text: 'nodeId', value: 'nodeId'},
                {text: 'eventId', value: 'eventId'},
                {text: 'type', value: 'type'},
                {text: 'status', value: 'status'},
                {text: 'count', value: 'count'}
            ]
        }
    },
    mounted() {
        this.nodeId = this.$store.state.selected_node_id
        this.getInfo()
    },
    computed: {
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        }
    },
    methods: {
        getInfo() {
            this.$store.state.node_component = "nodeInfo"
        },
        getParameters() {
            this.$store.state.node_component = "nodeParameters"
        },
        getVariables() {
            this.$store.state.node_component = "merg-canacc5-node-variables"
        },
        getEvents() {
            this.$store.state.node_component = "merg-canacc5-node-events"
        }
		
    },
    template: `
      <v-container>
      <h1>canacc5</h1>
      <v-tabs>
        <v-tab :key="1" @click="getInfo()">Info</v-tab>
        <v-tab :key="4" @click="getParameters()">Parameters</v-tab>
        <v-tab :key="2" @click="getVariables()" v-if="node.flim">Variables</v-tab>
        <v-tab :key="3" @click="getEvents()" v-if="node.EvCount > 0">Events</v-tab>
        <v-tab-item :key="1">
          <!--                    <nodeInfo :nodeId="node.node"></nodeInfo>-->
        </v-tab-item>
        <v-tab-item :key="2">
          <!--<merg-default-node-variables :nodeId="node.node"></merg-default-node-variables>-->
        </v-tab-item>
        <v-tab-item :key="3">
          <!--                    <merg-default-node-events :nodeId="node.node"></merg-default-node-events>-->
        </v-tab-item>
        <v-tab-item :key="4">
          <!--                    <nodeInfo :nodeId="node.node"></nodeInfo>-->
        </v-tab-item>
      </v-tabs>
      <v-container v-if="$store.state.debug">
        <p>{{ $store.state.node_component }}</p>
      </v-container>
      <component v-bind:is="$store.state.node_component"></component>
      <v-container v-if="$store.state.debug">
        <p>{{ JSON.stringify(node) }}</p>
      </v-container>
      </v-container>
    `
})

Vue.component('merg-canacc5-node-variables', {
    name: "merg-canacc5-node-variables",
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_VARIABLES', {
            "nodeId": this.nodeId,
            "variables": this.node.parameters[6],
            "delay": 20
        })
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
    },
    template: `
      <v-container>
      <v-row v-if="$store.state.debug">
        <h3>Node Variables</h3>
        <p>{{ node.variables }}</p>
      </v-row>
      <v-row>
        <merg-canacc5-variable-channel v-bind:nodeId="node.node"
                                       v-bind:channelId="n"
                                       v-for="n in [1,2,3,4,5,6,7,8]"
                                       :key="n">

        </merg-canacc5-variable-channel>
      </v-row>

 	  <v-row>
	  <node-variable-byteslider v-bind:nodeId="node.node" nodeVariableIndex=9 title="Feedback Delay" units="ms" scaling=0.5>
	  </node-variable-byteslider>
	  </v-row>
	  
      <v-row v-if="$store.state.debug">
        <node-variable v-bind:nodeId="node.node"
                       v-bind:varId="n"
                       v-for="n in node.parameters[6]"
                       :key="n">

        </node-variable>
      </v-row>

      <v-row v-if="$store.state.debug">
        <p>{{ node.variables }}</p>
      </v-row>
      </v-container>
    `
})

Vue.component('merg-canacc5-node-events', {
    name: "merg-canacc5-node-events",
    data: function () {
        return {
            eventDialog: false,
            editedEvent: {event: "0", variables: [], actionId: 1},
            headers: [
                {text: 'Event Name', value: 'event'},
                {text: 'Event', value: 'eventName'},
                {text: 'Action ID', value: 'actionId'},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
			addNewEventDialog: false
        }
    },
    methods: {
        editEvent: function (item) {
            console.log(`editEvent(${item.event})`)
            this.editedEvent = item
            this.$store.state.selected_action_id = item.actionId
            this.$store.state.node_component = "merg-canacc5-node-event-variables"

        },
        deleteEvent: function (event) {
            console.log(`deleteEvent : ${this.node.node} : ${event}`)
            this.$root.send('REMOVE_EVENT', {"nodeId": this.node.node, "eventName": event.event})
        }
    },
    mounted() {
        if (this.node.EvCount > 0) {
            console.log(`REQUEST_ALL_NODE_EVENTS : ${this.nodeId}`)
            this.$root.send('REQUEST_ALL_NODE_EVENTS', {"nodeId": this.nodeId})
        }
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
        eventList: function () {
            return Object.values(this.$store.state.nodes[this.$store.state.selected_node_id].actions)
        }
    },
    template: `
      <v-container>
      <v-data-table :headers="headers"
                    :items="eventList"
                    :items-per-page="20"
                    class="elevation-1"
                    item-key="id">
					
        <template v-slot:top>
            <v-toolbar flat>
		      <v-btn color="blue darken-1" @click.stop="addNewEventDialog = true" outlined>Add New Event</v-btn>

		  	  <v-dialog	v-model="addNewEventDialog" max-width="300">
			  <add-new-event-dialog v-on:close-addNewEventDialog="addNewEventDialog=false"></add-new-event-dialog>
			</v-dialog>
			  
            </v-toolbar>
        </template>
					
					
        <template v-slot:item.eventName="{ item }">
          <node-event-variable-display-name v-bind:eventId="item.event"></node-event-variable-display-name>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn color="blue darken-1" text @click="editEvent(item)" outlined>Edit</v-btn>
          <v-btn color="blue darken-1" text @click="deleteEvent(item)" outlined>Delete</v-btn>
        </template>
      </v-data-table>
      <v-row v-if="$store.state.debug">
        <p>{{ $store.state.nodes[this.nodeId].actions }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canacc5-node-event-variables', {
    name: "merg-canacc5-node-event-variables",
    mounted() {
        console.log(`merg-canacc5-node-event-variables mounted : ${this.$store.state.selected_node_id} :: ${this.$store.state.selected_action_id}`)
        this.$root.send('REQUEST_ALL_EVENT_VARIABLES', {
            "nodeId": this.$store.state.selected_node_id,
            "eventIndex": this.$store.state.selected_action_id,
            "variables": this.node.parameters[5]
        })
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        actionId: function () {
            return this.$store.state.selected_action_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        }
    },
    methods: {
        updateEV: function (nodeId, eventName, actionId, eventId, eventVal) {
            console.log(`editEvent(${nodeId},${eventName},${actionId},${eventId},${eventVal}`)
            this.$root.send('EVLRN', {
                "nodeId": this.node.node,
                "actionId": actionId,
                "eventName": eventName,
                "eventId": eventId,
                "eventVal": eventVal
            })
        }
    },
    template: `
      <v-container>
      <p>Event Index :: {{ $store.state.selected_action_id }}</p>
      <node-event-variable-bit-array v-bind:nodeId="$store.state.selected_node_id"
                                     v-bind:action="$store.state.selected_action_id"
                                     varId="1"
                                     name="Active Outputs">
      </node-event-variable-bit-array>
      <node-event-variable-bit-array v-bind:nodeId="$store.state.selected_node_id"
                                     v-bind:action="$store.state.selected_action_id"
                                     varId="2"
                                     name="Inverted Outputs">
      </node-event-variable-bit-array>

		<node-event-variable-bit v-bind:node="$store.state.selected_node_id"
								 v-bind:action="$store.state.selected_action_id"
                                 :variable="3"
								 :bit="7"
								 name="Feedback">
		</node-event-variable-bit>


      <v-row v-if="$store.state.debug">
        <node-event-variable v-bind:nodeId="$store.state.selected_node_id"
                             v-bind:actionId="$store.state.selected_action_id"
                             v-bind:varId="n"
                             v-for="n in node.parameters[5]"
                             :key="n">
        </node-event-variable>
		

		
      </v-row>
      <v-row v-if="$store.state.debug">
        <p>{{ node.actions[actionId] }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canacc5-variable-channel', {
    name: "merg-canacc5-variable-channel",
    props: ["nodeId", "channelId"],
    data: function () {
        return {
            variableLocal: 0,
            repeat: false,
            pulse: 0,
            max: 2500,
            min: 0,
            message: ""
        }
    },
    mounted() {
        this.updateVariables()
    },
    watch: {
        variableValue() {
            this.updateVariables()
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id].variables[this.channelId]
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
        type: function () {
            let value = this.node.variables[this.channelId]
            if (value == 0) {
                return 0
            } else if ((value > 0) & (value < 129)) {
                return 1
            } else {
                return 2
            }
        },
    },
    methods: {
        updateVariables() {
            if (this.variableValue < 126) {
                this.repeat = false
                this.pulse = this.variableValue * 20
                this.min = 0
            } else {
                this.repeat = true
                this.pulse = (this.variableValue - 128) * 20
                this.min = 20
            }
        },
        updateNV: function () {
            if (this.repeat) {
                this.variableLocal = this.pulse / 20 + 128
            } else {
                this.variableLocal = this.pulse / 20
            }
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId": this.channelId,
                "variableValue": this.variableLocal
            })
        }
    },
    template: `

      <!--<v-card class="xs6 md3 pa-3" flat outlined>
        <v-row>
          <div>Channel {{ channelId }} Variable {{ variableValue }} Local {{ variableLocal }}Repeat {{ repeat }} Pulse {{ pulse }}</div>
        </v-row>-->
      <v-card class="xs6 md3 pa-3" flat max-width="344" min-width="350">
      <v-card-title>Channel {{ channelId }}</v-card-title>
      <v-card-subtitle v-if="pulse > 0">Pulse {{ pulse }} ms</v-card-subtitle>
      <v-card-subtitle v-else>Continuous</v-card-subtitle>
      <v-card-text>
        <v-slider
            v-model="pulse"
            class="align-center"
            :max="max"
            :min="min"
            step="20"
            tick-size="4"
            hide-details
            @change="updateNV()"
        >

          <template v-slot:prepend>
            <v-icon color="blue" @click="updateNV(variableLocal-1)">
              mdi-minus
            </v-icon>
          </template>
          <template v-slot:append>
            <v-icon color="blue" @click="updateNV(variableLocal+1)">
              mdi-plus
            </v-icon>
          </template>
        </v-slider>
        <v-checkbox min-width="100"
                    v-model="repeat"
                    label="Repeat"
                    @change="updateNV()"
        ></v-checkbox>
      </v-card-text>
      </v-card>
      <!--      </v-card>-->
    `
})


Vue.component('node-variable-byteslider', {
    name: "node-variable-byteslider",
    props: ["nodeId", "nodeVariableIndex", "title", "units", "scaling"],
    data: function () {
        return {
            variableLocal: 0,
            sliderValue: 0,
            max: Math.floor(255 * this.scaling),
            min: 0,
        }
    },
    mounted() {
        this.updateVariables()
    },
    watch: {
        variableValue() {
            this.updateVariables()
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id].variables[this.nodeVariableIndex]
        },
    },
    methods: {
        updateVariables() {
            this.sliderValue = this.variableValue * this.scaling
            this.min = 0
        },
        updateNV: function () {
            this.variableLocal = this.sliderValue / this.scaling
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId":this.nodeVariableIndex,
                "variableValue": this.variableLocal
            })
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat max-width="344" min-width="350">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-subtitle>{{ sliderValue }} {{ units }}</v-card-subtitle>
      <v-card-text>
        <v-slider
            v-model="sliderValue"
            class="align-center"
            :max="max"
            :min="min"
            step="1"
            tick-size="4"
            hide-details
            @change="updateNV()"
        >
          <template v-slot:prepend>
            <v-icon color="blue" @click="updateNV()">
              mdi-minus
            </v-icon>
          </template>
          <template v-slot:append>
            <v-icon color="blue" @click="updateNV()">
              mdi-plus
            </v-icon>
          </template>
        </v-slider>
      </v-card-text>
      </v-card>
    `
})


