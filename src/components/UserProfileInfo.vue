<template>
    <div class="card">
        <div class="card-body">
            <div class="container">
                <div class="row">
                    <div class="col-3 img-field">
                        <img class="img-fluid" :src="user.photo" alt="userphoto">
                    </div>
                    <div class="col-9">
                        <div class="username">{{ user.username }}</div>
                        <div class="fans">粉丝: {{ user.followerCount }}</div>
                        <button @click="follow" v-if="!user.is_followed" type="button"
                            class="btn btn-secondary btn-sm">+关注</button>
                        <button @click="unfollow" v-if="user.is_followed" type="button"
                            class="btn btn-secondary btn-sm">取消关注</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { computed } from "vue";
import $ from 'jquery';
import { useStore } from 'vuex';

export default {
    name: "UserProfileInfo",
    props: {
        user: {
            type: Object,
            required: false,
        }
    },
    setup: (props, context) => {
        // 此处展示了动态计算的用法 实际上并没有使用 但需要使用时可以用以进行参考
        // let fullName = computed(() => props.user.firstName + ' ' + props.user.lastName);

        const store = useStore();
        const follow = () => {
            $.ajax({
                url: 'https://app165.acapp.acwing.com.cn/myspace/follow/',
                type: "POST",
                data: {
                    target_id: props.user.id,
                },
                headers: {
                    'Authorization': 'Bearer ' + store.state.user.access,
                },
                success: (resp) => {
                    if (resp.result === 'success') {
                        context.emit('follow');
                    }
                }
            });
        };

        const unfollow = () => {
            $.ajax({
                url: 'https://app165.acapp.acwing.com.cn/myspace/follow/',
                type: "POST",
                data: {
                    target_id: props.user.id,
                },
                headers: {
                    'Authorization': 'Bearer ' + store.state.user.access,
                },
                success: (resp) => {
                    if (resp.result === 'success') {
                        context.emit('unfollow');
                    }
                }
            })
        };

        // 注意此处返回时一定要加大括号！
        return {
            // fullName,
            follow,
            unfollow,
        };
    },
}
</script>

<style scoped>
img {
    border-radius: 50%;
}

.username {
    font-weight: bold;
}

.fans {
    font-size: 12px;
    color: grey;
}

button {
    padding: 2px 4px;
    font-size: 12px;
}

.img-field {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>