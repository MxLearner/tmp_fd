import { defineStore, acceptHMRUpdate } from "pinia";
export const useStore = defineStore({
    id: "index",
    state: () => ({
        userName: null as string | null,
        userId: null as string | null,
        userEmail: null as string | null,
    }),
    getters: {
        getUserName: (state) => {
            return state.userName
        },
        getUserId: (state) => {
            return state.userId;
        },
        getUserEmail: (state) => {
            return state.userEmail;
        }
    },
    actions: {
        setUserName(name: string | null) {
            this.userName = name;
        },
        setUserId(id: string | null) {
            this.userId = id;
        },
        setUserEmail(email: string | null) {
            this.userEmail = email;
        }
    }
});
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}