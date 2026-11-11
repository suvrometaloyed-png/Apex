import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';
import USERNAME_FIELD from '@salesforce/schema/User.Username';
import PHONE_FIELD from '@salesforce/schema/User.Phone';
import MOBILE_FIELD from '@salesforce/schema/User.MobilePhone';
import TITLE_FIELD from '@salesforce/schema/User.Title';
import DEPARTMENT_FIELD from '@salesforce/schema/User.Department';
import COMPANY_FIELD from '@salesforce/schema/User.CompanyName';
import ABOUT_FIELD from '@salesforce/schema/User.AboutMe';
import PHOTO_FIELD from '@salesforce/schema/User.MediumPhotoUrl';
import CITY_FIELD from '@salesforce/schema/User.City';
import STATE_FIELD from '@salesforce/schema/User.State';
import COUNTRY_FIELD from '@salesforce/schema/User.Country';
import POSTAL_FIELD from '@salesforce/schema/User.PostalCode';

const FIELDS = [
    NAME_FIELD,
    EMAIL_FIELD,
    USERNAME_FIELD,
    PHONE_FIELD,
    MOBILE_FIELD,
    TITLE_FIELD,
    DEPARTMENT_FIELD,
    COMPANY_FIELD,
    ABOUT_FIELD,
    PHOTO_FIELD,
    CITY_FIELD,
    STATE_FIELD,
    COUNTRY_FIELD,
    POSTAL_FIELD
];

export default class ProfilePage extends LightningElement {
    userId = Id;
    isEditMode = false;

    userFields = {
        name: NAME_FIELD,
        email: EMAIL_FIELD,
        username: USERNAME_FIELD,
        phone: PHONE_FIELD,
        mobilePhone: MOBILE_FIELD,
        title: TITLE_FIELD,
        department: DEPARTMENT_FIELD,
        companyName: COMPANY_FIELD,
        aboutMe: ABOUT_FIELD,
        city: CITY_FIELD,
        state: STATE_FIELD,
        country: COUNTRY_FIELD,
        postalCode: POSTAL_FIELD
    };

    @wire(getRecord, { recordId: '$userId', fields: FIELDS })
    user;

    get name() {
        return getFieldValue(this.user.data, NAME_FIELD);
    }

    get email() {
        return getFieldValue(this.user.data, EMAIL_FIELD);
    }

    get username() {
        return getFieldValue(this.user.data, USERNAME_FIELD);
    }

    get phone() {
        return getFieldValue(this.user.data, PHONE_FIELD);
    }

    get mobilePhone() {
        return getFieldValue(this.user.data, MOBILE_FIELD);
    }

    get title() {
        return getFieldValue(this.user.data, TITLE_FIELD);
    }

    get department() {
        return getFieldValue(this.user.data, DEPARTMENT_FIELD);
    }

    get companyName() {
        return getFieldValue(this.user.data, COMPANY_FIELD);
    }

    get aboutMe() {
        return getFieldValue(this.user.data, ABOUT_FIELD);
    }

    get photoUrl() {
        return getFieldValue(this.user.data, PHOTO_FIELD);
    }

    get location() {
        const city = getFieldValue(this.user.data, CITY_FIELD);
        const state = getFieldValue(this.user.data, STATE_FIELD);
        const country = getFieldValue(this.user.data, COUNTRY_FIELD);
        const parts = [city, state, country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'N/A';
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }

    handleSuccess() {
        this.isEditMode = false;
        // Optionally add toast logic if standard component doesn't show one
    }

    handleCancel() {
        this.isEditMode = false;
    }
}

