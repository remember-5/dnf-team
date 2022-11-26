import { ref, computed } from "vue";
import { defineStore } from "pinia";
import localdb from "@/utils/localstorage";
import { saveAs } from "file-saver";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

export const heroStore = defineStore("hero", {
  state: () => ({
    heroArray: [],
    groupArray: [],
  }),
  getters: {},
  actions: {
    appendHero(hero) {
      this.heroArray.push(hero);
    },
    appendGroup(group) {
      this.groupArray.push(group);
    },
    saveLocalStorage() {
      localdb.save("heroArray", this.heroArray);
      localdb.save("groupArray", this.groupArray);
    },
    editHeroArray(index, hero) {
      this.heroArray[index] = hero;
    },
    getLocalStorage() {
      this.heroArray = localdb.get("heroArray", []);
      this.groupArray = localdb.get("groupArray", []);
    },
    exportJsonData() {
      // 导出json文件;
      // new Bolb()第一个参数就是我们要导出的json数据
      let json = {
        heroArray: this.heroArray,
        groupArray: this.groupArray,
      };
      const blob = new Blob([JSON.stringify(json)], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `dnf.json`); // 后面的是json文件的默认名称
    },
    inputJsonData(data) {
      if (data) {
        let json = JSON.parse(data);
        this.heroArray = json.heroArray;
        this.groupArray = json.groupArray;
        this.saveLocalStorage();
      }
    },
    resetData() {
      this.groupArray = [];
      this.heroArray = [];
      localdb.remove("groupArray");
      localdb.remove("heroArray");
    },
  },
});
