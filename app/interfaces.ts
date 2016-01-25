export interface LoginData {

    ErrMsg: string;
    PreferredCampus: string;
    PreferredUnit: string;
    Status: string;
    UserName: string;
    idxLogin: string;
    idxUser: string;
    isAdmin: string;
    timeCwid: string;
    timeDb: string;
    timePswd: string;

}

export interface LocalLoginData {

    user: string;
    preferredCampus: string;
    preferredUnit: string;
    idxUser: string;
    idxLogin: string;
    isAdmin: string;
    loginTime: number;
}

export interface CheckInData {

//    rc: returnStatus;
    ErrMsg: string;
    Status: string;

    CheckedOutBy : string;
    CheckOutTime : string;
    CheckInTime  : string;
    TabletID     : string;
    idInventory  : string;

}


export interface LogoffData {

//    rc: returnStatus;
    ErrMsg: string;
    Status: string;

    PreferredCampus: string;
    PreferredUnit: string;
    UserName: string;
}


export interface Unit {

    active: string;
    campus: string;
    campus1: string;
    idUnit: number;
    name: string;
    site: string;
    unitCode: string;
    unitName: string;
}


export interface Units {

//    rc: returnStatus;
    ErrMsg: string;
    Status: string;

    Units: Unit[];
}

export interface returnStatus {

    ErrMsg: string;
    Status: string;

}

export interface Beds {

    // rc: returnStatus;
    ErrMsg: string;
    Status: string;

    BedPatients: Bed[];
}


export interface Bed {

    BedID: string;
    Campus: string;
    CheckInTime: string;
    CheckOutTime: string;
    CheckedInBy: string;
    CheckedOutBy: string;
    Discharged: string;
    ErrMsg: string;
    FirstName: string;
    LastName: string;
    MRN: string;
    Status: string;
    TabletID: string;
    Unit: string;
    idInventory: string;
    tabletype: string;
}
