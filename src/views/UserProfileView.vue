<template>
    <ContentBase>
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <UserProfileInfo @follow="follow" @unfollow="unfollow" :user="user"></UserProfileInfo>
                    <UserProfileWrite v-if="is_me" @post_a_post="post_a_post"></UserProfileWrite>
                </div>
                <div class="col-9">
                    <UserProfilePosts @delete_a_post="delete_a_post" :user="user" :posts="posts"></UserProfilePosts>
                </div>
            </div>
        </div>
    </ContentBase>
</template>

<script>
import ContentBase from "../components/ContentBase.vue";
import UserProfileInfo from "../components/UserProfileInfo.vue";
import UserProfilePosts from "../components/UserProfilePosts.vue";
import UserProfileWrite from "../components/UserProfileWrite.vue";
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import $ from 'jquery';
import { computed } from 'vue';

export default {
    name: "UserProfileView",
    components: {
        ContentBase,
        UserProfileInfo,
        UserProfilePosts,
        UserProfileWrite
    },
    setup: () => {
        const store = useStore();
        const route = useRoute();
        //此处的userId即路由中写到的userId 表示当前页面的userId是多少 不一定是用户本人的
        // 传入的userId实际上是一个字符串 这里将其转换为整数
        const userId = parseInt(route.params.userId);

        const user = reactive({});
        const posts = reactive({});

        // 获取用户信息
        $.ajax({
            url: 'https://app165.acapp.acwing.com.cn/myspace/getinfo/',
            type: "GET",
            data: {
                user_id: userId,
            },
            headers: {
                'Authorization': 'Bearer ' + store.state.user.access,
            },

            success: (resp) => {
                user.id = resp.id;
                user.username = resp.username;
                user.photo = resp.photo;
                user.followerCount = resp.followerCount;
                user.is_followed = resp.is_followed;
            }
        });

        // 获取用户帖子
        $.ajax({
            url: 'https://app165.acapp.acwing.com.cn/myspace/post/',
            type: "GET",
            data: {
                user_id: userId,
            },
            headers: {
                'Authorization': 'Bearer ' + store.state.user.access,
            },

            success: (resp) => {
                posts.count = resp.length; //注意要更新count
                posts.posts = resp;
            }
        });

        const follow = () => {
            if (user.is_followed) return;
            user.is_followed = true;
            user.followerCount++;
        };

        const unfollow = () => {
            if (!user.is_followed) return;
            user.is_followed = false;
            user.followerCount--;
        };

        const post_a_post = (content) => {
            posts.count++;
            posts.posts.unshift(
                {
                    id: posts.count,
                    userId: 1,
                    content: content,
                }
            );
        };

        const delete_a_post = (post_id) => {
            posts.posts = posts.posts.filter((post) => { return post.id !== post_id });
            posts.count = posts.posts.length;
        }

        const is_me = computed(() => { return userId === store.state.user.id });

        return {
            user,
            follow,
            unfollow,
            posts,
            post_a_post,
            is_me,
            delete_a_post,
        }
    },
}

</script>

<style scoped></style>