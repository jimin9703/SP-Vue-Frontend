<template>
    <v-container class="my-10">
      <h2 class="headline">여행지 리스트</h2>
      <v-row v-if="travelList && travelList.length > 0">
        <v-col
          v-for="(travel, index) in travelListWithIntegerPrices"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="ma-5 travel-card" elevation="12" @click="goToTravelReadPage(travel.travelId)">
            <v-img
              :src="getImageUrl(travel.travelImage)"
              height="200px" 
              class="white--text"
              gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,0.1)" 
              style="border-top-left-radius: 10px; border-top-right-radius: 10px;"
              cover
            ></v-img>
  
            <v-card-title class="headline mb-2">{{ travel.travelName }}</v-card-title>
  
            <v-card-subtitle class="px-2 pb-2">{{ travel.travelPrice }}원</v-card-subtitle>
  
            <v-card-text class="px-4">
              <div class="ellipsis-text">{{ shortenText(travel.travelContent, 150) }}</div>
            </v-card-text>
  
            
          </v-card>
          <v-card-actions class="pa-3">
              <v-btn color="error" @click="proceedToOrder(travel)">주문하기</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12" class="text-center">
          <v-alert type="info">등록된 여행 상품이 없습니다!</v-alert>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { mapActions, mapState } from "vuex";
  
  export default {
    computed: {
      ...mapState("travelModule", ["travelList"]),
      travelListWithIntegerPrices() {
      return this.travelList.map(travel => ({
        ...travel,
        travelPrice: Math.round(travel.travelPrice)
      }));
    }
    },
    mounted() {
      this.requestTravelListToDjango();
    },
    methods: {
      ...mapActions("travelModule", ["requestTravelListToDjango"]),
      ...mapActions("orderModule", ["requestCreateOrderToDjango"]),
      getImageUrl(imageName) {
        return require(`@/assets/images/uploadImages/${imageName}`);
      },
      goToTravelReadPage(travelId) {
        this.$router.push({ name: "TravelReadPage", params: { travelId: travelId } }).catch((err) => {
          console.error(err);
        });
      },
      shortenText(text, maxLength) {
        if (text.length <= maxLength) {
          return text;
        } else {
          return text.substr(0, maxLength - 3) + "...";
        }
      },
      async proceedToOrder(travel) {
            this.isCheckoutDialogVisible = false;

            try {
                const currentSelectedItem = {
                    travelId: travel.travelId, // 현재 선택된 여행 상품 ID
                    travelName: travel.travelName, // 현재 선택된 여행 상품 이름
                    orderPrice: travel.travelPrice, // 현재 선택된 여행 상품 가격
                    registerDate: new Date().toISOString()
                };
                console.log("currentSelectedItem:", currentSelectedItem);
                
                const userToken = localStorage.getItem('userToken');
                const orderId = await this.requestCreateOrderToDjango({
                    userToken,
                    items: [currentSelectedItem]
                });

                // await this.$router.push({ name: 'HomeView' })
                // this.$router.push('/') // 샀던 목록으로 이동하기
                this.$router.push({ name: 'OrderReadPage', params: { orderId: orderId.toString() } });
            } catch (error) {
                console.error("Order creation failed:", error);
            }
        }
  
    },
  };
  </script>
  
  <style scoped>
  .headline {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .travel-card {
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
  }
  
  .caption {
    font-size: 16px;
    color: #757575;
  }
  
  .v-btn {
    font-weight: bold;
  }
  
  .v-btn:hover {
    background-color: #1976d2;
    color: white;
  }
  
  .ellipsis-text {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* 원하는 줄 수로 수정하세요 */
    -webkit-box-orient: vertical;
    max-height: 60px; /* 최대 높이를 설정해주세요 */
  }
  
  .v-card-title {
    padding: 16px; /* 적절한 패딩 설정 */
  }
  
  .v-card-subtitle {
    padding: 0 16px 16px; /* 적절한 패딩 설정 */
    font-size: 18px; /* 원하는 크기로 수정하세요 */
  }
  </style>
  