Vue.component('merg-canacc8', {
    name: "merg-canacc8",
    //mixins: [nodeMixin],
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
        getVariables() {
            this.$store.state.node_component = "merg-canacc8-node-variables"
        },
        getEvents() {
            console.log(`mergDefault - NERD : ${this.nodeId}`)
            //this.$root.send('NERD', {'nodeId': this.nodeId})
            this.$store.state.node_component = "merg-canacc8-node-events"
        }
    },
    template: `
      <v-container>
      <h1>CANACC8</h1>
      <v-tabs>
        <v-tab :key="1" @click="getInfo()">Info</v-tab>
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

Vue.component('merg-canacc8-node-variables', {
    name: "merg-canacc8-node-variables",
    //props: ['nodeId'],
    mounted() {
        for (let i = 1; i <= this.node.parameters[6]; i++) {
            let time = i*100
            setTimeout(this.getVariable,time,i)
        }
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
    },
    methods: {
        getVariable: function (parameter) {
            this.$root.send('NVRD', {"nodeId": this.nodeId, "variableId": parameter})
        }
    },
    template: `
      <v-container>
      <h3>Node Variables</h3>
      <v-row>
      <merg-canacc8-variable-channel v-bind:nodeId="node.node"
                                     v-bind:channelId="n"
                                     v-for="n in [1,2,3,4,5,6,7,8]"
                                     :key="n">
      
      </merg-canacc8-variable-channel>
      </v-row>
      <v-row>
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

Vue.component('merg-canacc8-node-events', {
    name: "merg-canacc8-node-events",
    //props: ['nodeId'],
    data: function () {
        return {
            eventDialog: false,
            editedEvent: {event: "0", variables: [], actionId: 1},
            headers: [
                {text: 'Event Name', value: 'event'},
                {text: 'Action ID', value: 'actionId'},
                {text: 'Actions', value: 'actions', sortable: false}
            ]
        }
    },
    methods: {
        editEvent: function (item) {
            console.log(`editEvent(${item.event})`)
            for (let i = 1; i <= this.node.parameters[5]; i++) {
                this.$root.send('REVAL', {"nodeId": this.nodeId, "actionId": item.actionId, "valueId": i})
            }
            //this.eventDialog = true
            this.editedEvent = item
            this.$store.state.selected_action_id = item.actionId
            this.$store.state.node_component = "merg-canacc8-node-event-variables"

        },
        deleteEvent: function (event) {
            console.log(`deleteEvent : ${this.node.node} : ${event}`)
            this.$root.send('EVULN', {"nodeId": this.node.node, "eventName": event})
        }
    },
    mounted() {
        if (this.node.EvCount > 0) {
            console.log(`NERD : ${this.nodeId}`)
            this.$root.send('NERD', {"nodeId": this.nodeId})
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
      <v-card>
        <v-data-table :headers="headers"
                      :items="eventList"
                      :items-per-page="20"
                      class="elevation-1"
                      item-key="id">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Events for {{ node.node }}</v-toolbar-title>
              <v-divider
                  class="mx-4"
                  inset
                  vertical
              ></v-divider>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn color="blue darken-1" text @click="editEvent(item)" outlined>Edit</v-btn>
            <v-btn color="blue darken-1" text @click="deleteEvent(item)" outlined>Delete</v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-row v-if="$store.state.debug">
        <p>{{ $store.state.nodes[this.nodeId].actions }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canacc8-node-event-variables', {
    name: "merg-canacc8-node-event-variables",
    //props: ['nodeId', 'actionId'],
    mounted() {
        console.log(`merg-canacc8-node-event-variables mounted : ${this.$store.state.selected_node_id} :: ${this.$store.state.selected_action_id}`)
        for (let i = 1; i <= this.node.parameters[5]; i++) {
            let time = i*100
            setTimeout(this.getEventVariable,time,i)
        }
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
        getEventVariable: function (parameter) {
            this.$root.send('REVAL', {
                "nodeId": this.$store.state.selected_node_id,
                "actionId": this.$store.state.selected_action_id,
                "valueId": parameter
            })
        },
        updateEV: function (nodeId, eventName, actionId, eventId, eventVal) {
            // eslint-disable-next-line no-console
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
      <h3>Event Variables</h3>
      <p>Event ID :: {{ $store.state.selected_action_id }}</p>
      <!--<p>{{ $store.state.nodes[this.$store.state.selected_node_id].actions[$store.state.selected_action_id] }}</p>-->
      <!--<v-card outlined>
        <v-card-title>Startup Options</v-card-title>
        <v-card-text>
          <v-radio-group v-model="node.actions[actionId].variables[1]" :mandatory="true"
                         @change="updateEV(node.node,
                                   node.actions[actionId].event,
                                   node.actions[actionId].actionId,
                                   3,
                                   parseInt(node.actions[actionId].variables[1]))">
            <v-radio label="SOD" :value="0"></v-radio>
            <v-radio label="Route" :value="1"></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>
      <v-row>
        <node-event-variable-bit v-bind:node="$store.state.selected_node_id"
                                 v-bind:action="$store.state.selected_action_id"
                                 variable="1"
                                 bit="0"
                                 name="0">
        </node-event-variable-bit>
      </v-row>-->
      <node-event-variable-bit-array v-bind:nodeId="$store.state.selected_node_id"
                                     v-bind:action="$store.state.selected_action_id"
                                     varId="1"
                                     name="Active">
      </node-event-variable-bit-array>
      <node-event-variable-bit-array v-bind:nodeId="$store.state.selected_node_id"
                                     v-bind:action="$store.state.selected_action_id"
                                     varId="2"
                                     name="Inverted">
      </node-event-variable-bit-array>

      <v-row>
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

Vue.component('merg-canacc8-variable-channel', {
    name: "merg-canacc8-variable-channel",
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
            this.$root.send('NVSET', {
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
      <v-card class="xs6 md3 pa-3" flat max-width="344" min-width="250">
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
        <node-variable-bit v-bind:nodeId="nodeId" varId="11" v-bind:bit="channelId-1"
                           name="Respond to SOD"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" varId="10" v-bind:bit="channelId-1"
                           name="Send Off instead of Saved Event"></node-variable-bit>
      </v-card-text>
      </v-card>
      <!--      </v-card>-->
    `
})