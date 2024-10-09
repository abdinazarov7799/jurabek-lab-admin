import {create} from 'zustand'
import {devtools, persist} from "zustand/middleware";
import config from "../config";
import storage from "../services/storage";


let store = (set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set(state => ({...state, user})),
    setAuthenticated: (isAuthenticated) => set(state => ({...state, isAuthenticated})),
})

let settingsStore = (set) => ({
    token: null,
    darkMode: storage.get('darkMode') || false,
    lang: storage.get('lang') ||  config.DEFAULT_APP_LANG,
    refreshToken: null,
    setRefreshToken: (refreshToken) => set(state => ({...state, refreshToken})),
    setToken: (token) => set(state => ({...state, token})),
    setLang: (lang) => set(state => ({...state, lang})),
    setDarkMode: () => set(state => ({...state, darkMode: !state.darkMode})),
})


store = devtools(store);
settingsStore = devtools(settingsStore)
settingsStore = persist(settingsStore, {name: 'settings'});

export const useStore = create(store)
export const useSettingsStore = create(settingsStore)

