import $ from 'jquery';
import jwt_decode from "jwt-decode";

const ModuleUser = {
    state: {
        user: {
            id: "",
            username: "",
            photo: "",
            followerCount: 0,
            access: "",
            refresh: "",
            is_login: false,
        },
    },
    getters: {
    },
    //更新state的操作只能在mutations里进行 不能在actions里进行
    //不直接写在mutations里是习惯问题
    //另外需要注意的是 mutations里只能写同步的api 所以异步的api一般都放在actions里写
    mutations: {
        //state是要更新的state 后面的user是自己传的参数
        updateUser: (state, user) => {
            state.id = user.id;
            state.username = user.username;
            state.photo = user.photo;
            state.followerCount = user.followerCount;
            state.access = user.access;
            state.refresh = user.refresh;
            state.is_login = user.is_login;
        },
        //更新令牌后需要更新access
        updateAccess: (state, access) => {
            state.access = access;
        },
        //此处将logout的逻辑写在了mutations中是因为该操作是同步的 且逻辑上相当于是对state的一次更新
        logout: (state) => {
            state.id = "";
            state.username = "";
            state.photo = "";
            state.followerCount = 0;
            state.access = "";
            state.refresh = "";
            state.is_login = false;
        }
    },
    actions: {
        // context是默认要传给login的参数 后面的data是自己传的
        // 一般都是传这样两个参数给login
        login: (context, data) => {
            $.ajax({
                //下面是获取token信息
                url: 'https://app165.acapp.acwing.com.cn/api/token/',
                type: "POST",
                //注意这里的data类似于关键字 用来存储ajax调用api时需要传入的参数
                // 而上面的data是传入给login函数的参数 两者完全不同
                data: {
                    username: data.username,
                    password: data.password,
                },
                success: (resp) => {
                    const { access, refresh } = resp;
                    const access_obj = jwt_decode(access);

                    //由于access每隔五分钟过期 此处采用傻瓜式的方法 每隔五分钟通过refresh刷新一次令牌
                    setInterval(() => {
                        $.ajax({
                            url: 'https://app165.acapp.acwing.com.cn/api/token/refresh/',
                            type: "POST",
                            data: {
                                refresh: refresh,
                            },
                            //如果刷新成功 需要将返回的新令牌重新赋值给当前的access
                            success: (resp) => {
                                context.commit("updateAccess", resp.access);
                            }
                        })
                    }, 4.5 * 60 * 1000) //为了防止出现边界情况 每隔4.5分钟进行一次刷新

                    $.ajax({
                        url: 'https://app165.acapp.acwing.com.cn/myspace/getinfo/',
                        type: "GET",
                        data: {
                            user_id: access_obj.user_id,
                        },
                        //下面是进行jwt验证的写法 背过即可 注意包括每一个小空格都需要背过
                        //注意如果某个api没有授权 是不能加上这个的
                        //注意这里的Bearer后面有空格
                        headers: {
                            'Authorization': 'Bearer ' + access,
                        },
                        success: (resp) => {
                            //下面是调用mutations里的更新函数
                            //api是context.commit
                            context.commit("updateUser", {
                                ...resp, //语法糖 解构resp,
                                access: access,
                                refresh: refresh,
                                is_login: true,
                            });
                            data.success();
                            // //在这里将access存在本地以实现刷新不刷新登陆状态？
                            // localStorage.setItem('access', access);
                        },
                    })
                },
                error: () => {
                    data.error();
                }
            })
        },
    },
    modules: {
    }
};

export default ModuleUser;