<template>
    <v-container>
        <h2>리뷰 글 수정!</h2>
        <v-card v-if="travelBoard">
            <v-card-title>게시물 정보</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="title" label="제목"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="travelBoard.writer" readonly label="작성자"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-textarea v-model="review" label="내용" auto-grow/>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-file-input v-model="reviewImage" label="이미지 파일" prepend-icon="mdi-camera"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <p v-if="uploadedFileName">업로드된 파일: {{ uploadedFileName }}</p>
                        </v-col>
                    </v-row>

                    <v-row justify="end">
                        <v-col cols="auto">
                            <v-btn color="primary" @click="onModify">수정 완료</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <router-link :to="{ name: 'TravelBoardReadPage' }">
                                <v-btn color="secondary">돌아가기</v-btn>
                            </router-link>
                          </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const travelBoardModule = 'travelBoardModule'

export default {
    props: {
        BoardId: {
            type: String,
            required: true,
        }
    },
    data () {
        return {
            title: '',
            writer: '',
            review: '',
            reviewImage: null, // 이거 추가해야 등록이미지가 맺힘
        }
    },
    computed: {
        ...mapState(travelBoardModule, ['travelBoard'])
    },
    methods: {
        ...mapActions(travelBoardModule, ['requestTravelBoardToDjango', 'requestModifyTravelBoardToDjango']),
        async onModify () {
            console.log('수정 완료를 누르셨습니다!')

            // 이미지 빼고는 다 수정 가능
            // const payload = {
            //     title: this.title,
            //     review: this.review,
            //     boardId: this.BoardId,
            // }
            //await this.requestModifyTravelBoardToDjango(payload)
            // await this.$router.push({ 
            //     name: 'TravelBoardReadPage',
            //     params: { BoardId: this.BoardId } 
            // })

            // 이미지 수정 까지 처리
            try {
                if (this.reviewImage) {
                    const imageFormData = new FormData()
                    imageFormData.append('title', this.title)
                    imageFormData.append('boardId',this.BoardId)
                    imageFormData.append('review', this.review)
                    imageFormData.append('reviewImage', this.reviewImage)
                    
                    const response = await this.requestModifyTravelBoardToDjango(imageFormData)
                    console.log('modify response :', response)
                    this.uploadedFileName = response.data.reviewImage
                    
                    await this.$router.push({ 
                        name: 'TravelBoardReadPage',
                        params: { BoardId: this.BoardId } 
                    })
                } else {
                    console.log('이미지 파일을 선택하세요!')
                }
            } catch (error) {
                console.log('파일 처리 과정에서 에러 발생:', error)
            }
        },
    },
    created () {
        console.log("boardId:",this.BoardId)
        this.requestTravelBoardToDjango(this.BoardId).then(() => {
            this.title = this.travelBoard.title
            this.writer = this.travelBoard.writer
            this.review = this.travelBoard.review
        })
    },
}
</script>