pragma circom 2.1.2;

include "../node_modules/circomlib/poseidon.circom";

template DualMux() {
    signal input in[2];
    signal input s;
    signal output out[2];

    assert(s * (1 - s) == 0);
    out[0] <== (in[1] - in[0])*s + in[0];
    out[1] <== (in[0] - in[1])*s + in[1];
}

template ZkIdentity (levels) {
    signal input tc[11];
    signal input birthdate[3];
    signal input currentdate[3];
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal input leaf;
    signal output mt_leaf;

    // check if the given turkish citizen number is correct
    var i;
    var sum1 = 0;
    for (i=0; i<10; i=i+2) {
        sum1 = tc[i] + sum1;
    }
    var sum2 = 0;
    for (i=1; i<9; i=i+2) {
        sum2 = tc[i] + sum2;

    }
    sum1 = sum1 * 7;

    var diff = sum1 - sum2;
    var mod10 = diff % 10;

    assert(mod10 == tc[9]); // control 1

    var sum3 = 0;
    for (i=0; i<=9; i++) {
        sum3 = tc[i] + sum3;
    }

    var mod102 = sum3 % 10;

    assert(mod102 == tc[10]); // control 2

    // assert(birthdate[2] < currentdate[2]); // you cant just born this year or maybe you can? :D

    // check if you are older than 18
    assert(birthdate[2] < currentdate[2]);

    var age = currentdate[2] - birthdate[2];
    if(age < 18){
        assert(age > 18);
    }
    if(age == 18){
        assert(currentdate[1] > birthdate[1]);
    }


    // creating hash of the identity for membership proof
    component hashleaf = Poseidon(14);

    var v;

    for (v=0; v<=10; v++) {
        hashleaf.inputs[v] <== tc[v];

    }
    var x;
    for (v=11; v<14; v++) {
        hashleaf.inputs[v] <== birthdate[x];
        x= x+1;
    }
    mt_leaf <== hashleaf.out;
    assert(mt_leaf == leaf);

    component selectors[levels];
    component hashers[levels];


    for (var i = 0; i < levels; i++) {
        selectors[i] = DualMux();
        selectors[i].in[0] <== i == 0 ? leaf : hashers[i - 1].out;
        selectors[i].in[1] <== pathElements[i];
        selectors[i].s <== pathIndices[i];

        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== selectors[i].out[0];
        hashers[i].inputs[1] <== selectors[i].out[1];
    }
    assert(root == hashers[levels - 1].out);
}

component main { public [ currentdate,root,leaf ] }= ZkIdentity(10);

/* INPUT = {
    "tc": ["7","2","9","5","6","5","5","6","2","5","2"],
    "birthdate": ["2","2","2005"],
    "currentdate": ["5","3","2023"],
    "root": "3176374965215286996139141856407167738459476439549462353518042959695917572425",
    "pathElements": [
    "21663839004416932945382355908790599225266501822907911457504978515578255421292",
    "8995896153219992062710898675021891003404871425075198597897889079729967997688",
    "15126246733515326086631621937388047923581111613947275249184377560170833782629",
    "6404200169958188928270149728908101781856690902670925316782889389790091378414",
    "17903822129909817717122288064678017104411031693253675943446999432073303897479",
    "11423673436710698439362231088473903829893023095386581732682931796661338615804",
    "10494842461667482273766668782207799332467432901404302674544629280016211342367",
    "17400501067905286947724900644309270241576392716005448085614420258732805558809",
    "7924095784194248701091699324325620647610183513781643345297447650838438175245",
    "3170907381568164996048434627595073437765146540390351066869729445199396390350"
    ],
    "pathIndices": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "leaf": "9446636441302590936210484803312685572524984347315367043401176974089965066742"
} */
