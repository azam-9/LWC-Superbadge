import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

export default class BoatSearch extends NavigationMixin(LightningElement) {
    @api isLoading = false;
    @api response;
    @api error;
    @api boatTypeId = ' ';

    constructor() {
        super();
        this.searchBoats();
    }

    handleLoading() {
        this.isLoading = true;
    }

    // Handles done loading event
    handleDoneLoading(event) {
        this.isLoading = false;
    }
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {

        if (event) {
            console.log(event.detail.boatTypeId);
            this.boatTypeId = event.detail.boatTypeId;
        }

        // this.template.querySelector("c-boat-search-results").searchBoats(this.boatTypeId);

        getBoats({ boatTypeId: this.boatTypeId })
            .then(result => {
                this.response = result;
                this.isLoading = false;
            })
            .catch(error => {
                this.error = error;
                this.isLoading = false;
            })

    }

    createNewBoat() {
        console.log('in');
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "new",
                objectApiName: "Boat__c"
            }
        });
    }
}