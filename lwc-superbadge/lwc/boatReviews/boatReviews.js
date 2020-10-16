import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";

export default class BoatReviews extends NavigationMixin(LightningElement) {


    boatId;
    error;
    boatReviews = [];
    isLoading = false;

    @api
    get recordId() {
        return this.boatId;
    }


    set recordId(value) {
        this.boatId = value;
        this.setAttribute('boatId', value);
        this.getReviews();
    }

    get reviewsToShow() {
        return this.boatReviews.length > 0;
    }

    @api refresh() {
        this.getReviews();
    }

    getReviews() {
        if (!this.boatId)
            return;
        this.isLoading = true;
        getAllReviews({ boatId: this.boatId })
            .then(result => {
                console.table(result);
                this.boatReviews = result;
                console.table(this.boatReviews);
            })
            .catch(error => {
                console.log(error.message);
            })

        this.isLoading = false;

    }

    navigateToRecord(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.details.recordId,
                actionName: 'view',
            },
        });
    }
}