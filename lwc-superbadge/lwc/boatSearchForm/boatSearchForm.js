import { LightningElement, wire, track } from 'lwc';
// imports
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
export default class BoatSearchForm extends LightningElement {

    selectedBoatTypeId = '';

    // Private
    error = undefined;

    // Needs explicit track due to nested data
    @track
    searchOptions;

    // Wire a custom Apex method
    @wire(getBoatTypes)
    boatTypes({ error, data }) {
        if (data) {
            this.searchOptions = data.map(type => {

                const boattype = {
                    label: type.Name,
                    value: type.Id
                }
                return boattype;
            }
            );
            this.searchOptions.unshift({ label: 'All Types', value: '' });

        } else if (error) {
            console.log(error);
            this.searchOptions = undefined;
            this.error = error;
        }
    }

    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
        // Create the const searchEvent
        // searchEvent must be the new custom event search
        event.preventDefault();
        this.selectedBoatTypeId = event.target.value;

        const searchevent = new CustomEvent('search', {
            detail: {
                boatTypeId: this.selectedBoatTypeId
            }

        });
        this.dispatchEvent(searchevent);

    }
}