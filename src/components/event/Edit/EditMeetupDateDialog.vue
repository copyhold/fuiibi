<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn accent slot="activator">
      Edit date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit meetup date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editableDate" style="width: 100%" actions>
              <template slot-scope="{save, cancel}">
                <v-btn class="blue--text darken-1" flat @click.native="editDialog = false">Close</v-btn>
                <v-btn class="blue--text darken-1" flat @click.native="onSaveChanges">Save</v-btn>
              </template>
            </v-date-picker>
          </v-flex>
        </v-layout>

      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    propos: ['meetup'],
    data () {
      return {
        editDialog: false,
        editableDate: ''
      }
    },
    methods: {
      onSaveChanges () {
        console.log('in onSaveChanges - editableDate', this.editableDate, 'meetup - ', this.meetup.date)
        // Below, we first save the original date in the newDate using the meetup date, and then we stock the choice of the user in the newDay
        const newDate = new Date(this.meetup.date)
        const newDay = new Date(this.editableDate).getUTCDate()
        const newMonth = new Date(this.editableDate).getUTCMonth()
        const newYear = new Date(this.editableDate).getUTCFullYear()
        newDate.setUTCDate(newDay)
        newDate.setUTCMonth(newMonth)
        newDate.setUTCFullYear(newYear)
        this.$store.dispatch('updateMeetupData', {
          id: this.meetup.id,
          date: newDate
        })
      }
    }
    // The editableDate brings me an error, dont know how to solve it.
    // created () {
    //   console.log('in created', this.meetup.date)
    //   // this.editableDate = new Date(this.meetup.date)
    // }
  }
</script>
