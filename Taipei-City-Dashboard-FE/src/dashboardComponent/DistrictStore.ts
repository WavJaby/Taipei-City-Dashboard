import { defineStore } from "pinia";
import { ref } from "vue";

export const useDistrictStore = defineStore("district", () => {
	const selectedDistrictIndex = ref(null);
	const hoverDistrict = ref(null);
	const toolTipOffset = ref([0, 0]);

	const selectDistrict = (index: number) => {
		selectedDistrictIndex.value = index;
	};

	const toggleHoverDistrict = (district: string) => {
		hoverDistrict.value = district;
	};

	const setToolTipOffset = (offX: number, offY: number) => {
		toolTipOffset.value = [offX, offY];
	};

	const clearSelection = () => {
		selectedDistrictIndex.value = null;
		hoverDistrict.value = null;
	};

	return {
		selectedDistrictIndex,
		hoverDistrict,
		toolTipOffset,
		selectDistrict,
		toggleHoverDistrict,
		setToolTipOffset,
		clearSelection
	};
});

export const districtsIndex = [
	"北投區",
	"士林區",
	"內湖區",
	"南港區",
	"松山區",
	"信義區",
	"中山區",
	"大同區",
	"中正區",
	"萬華區",
	"大安區",
	"文山區",
	"新莊區",
	"淡水區",
	"汐止區",
	"板橋區",
	"三重區",
	"樹林區",
	"土城區",
	"蘆洲區",
	"中和區",
	"永和區",
	"新店區",
	"鶯歌區",
	"三峽區",
	"瑞芳區",
	"五股區",
	"泰山區",
	"林口區",
	"深坑區",
	"石碇區",
	"坪林區",
	"三芝區",
	"石門區",
	"八里區",
	"平溪區",
	"雙溪區",
	"貢寮區",
	"金山區",
	"萬里區",
	"烏來區",
];
