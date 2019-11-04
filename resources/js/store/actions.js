import axios from 'axios'

export const setDeviceConfig = ({commit}) => {
    commit('setDeviceConfig')
}

export const setNewConfig = ({commit}, payload) => {
    commit('setNewConfig', payload)
}

export const documentClicked = ({commit}) => {
    commit('documentClicked')
}

export const startCardReadLoop = ({commit, state}) => {
    // console.log(window.SoftSPI)
    console.log(window.Mfrc522)

    const softSPI = new window.SoftSPI({
        clock: 23, // pin number of SCLK
        mosi: 19, // pin number of MOSI
        miso: 21, // pin number of MISO
        client: 24 // pin number of CS
      });

      const mfrc522 = new window.Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

      setInterval(function() {
        //# reset card
        mfrc522.reset();
      
        //# Scan for cards
        let response = mfrc522.findCard();
        if (!response.status) {
          console.log("No Card");
          return;
        }
        console.log("Card detected, CardType: " + response.bitSize);
      
        //# Get the UID of the card
        response = mfrc522.getUid();
        if (!response.status) {
          console.log("UID Scan Error");
          return;
        }
        //# If we have the UID, continue
        const uid = response.data;
        console.log(
          "Card read UID: %s %s %s %s",
          uid[0].toString(16),
          uid[1].toString(16),
          uid[2].toString(16),
          uid[3].toString(16)
        );
      
        //# Select the scanned card
        const memoryCapacity = mfrc522.selectCard(uid);
        console.log("Card Memory Capacity: " + memoryCapacity);
      
        //# This is the default key for authentication
        const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
      
        //# Authenticate on Block 8 with key and uid
        if (!mfrc522.authenticate(8, key, uid)) {
          console.log("Authentication Error");
          return;
        }
      
        //# Dump Block 8
        console.log("Block: 8 Data: " + mfrc522.getDataForBlock(8));
      
        //# Stop
        mfrc522.stopCrypto();
      }, 500);
}