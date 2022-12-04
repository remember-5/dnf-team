import { ref, computed } from "vue";
import { defineStore } from "pinia";
import localdb from "@/utils/localstorage";
import { saveAs } from "file-saver"; // npm i file-saver

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
    /**
     * 保存到缓存和pinia
     * @param heroArray
     * @param groupArray
     */
    save(heroArray, groupArray) {
      this.heroArray = heroArray;
      this.groupArray = groupArray;
      this.saveLocalStorage();
    },
    saveLocalStorage() {
      localdb.save("heroArray", this.heroArray);
      localdb.save("groupArray", this.groupArray);
    },
    editHeroArray(index, hero) {
      this.heroArray[index] = hero;
    },
    deleteHero(index) {
      this.heroArray.splice(index, 1);
    },
    getLocalStorage() {
      this.heroArray = localdb.get("heroArray", []);
      this.groupArray = localdb.get("groupArray", []);
      if (this.groupArray.length === 0) {
        this.groupArray.push([]);
      }
    },
    exportJsonData(heroArray, groupArray) {
      // 导出json文件;
      // new Bolb()第一个参数就是我们要导出的json数据
      let json = {
        heroArray: heroArray,
        groupArray: groupArray,
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
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;

          return v.toString(16);
        }
      );
    },
  },
});
