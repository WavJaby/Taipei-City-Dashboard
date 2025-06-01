<!-- Developed by Taipei Urban Intelligence Center 2023-2024-->

<script setup>
import { computed, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useDistrictStore, districtsIndex } from "../DistrictStore";

const districtStore = useDistrictStore();

const props = defineProps([
	"chart_config",
	"activeChart",
	"series",
	"map_config",
	"map_filter",
	"map_filter_on"
]);

const emits = defineEmits([
	"filterByParam",
	"filterByLayer",
	"clearByParamFilter",
	"clearByLayerFilter",
	"fly"
]);

// How many data points to show before summing all remaining points into "other"
const steps = ref(8);
const districtName = ref("");

// Donut charts in apexcharts uses a slightly different data format from other chart types
// As such, the following parsing functions are required
const parsedSeries = computed(() => {
	const districtIndex = districtStore.selectedDistrictIndex; // Force reactivity

	let index = 0;
	if (districtIndex != null) {
		const name = districtsIndex[districtIndex];
		districtName.value = name;
		index = props.series.findIndex(i => i.name === name);
	}

	// Reset to total if index not found
	if (!districtIndex || index === -1) {
		districtName.value = "";
		index = 0;
	}

	const toParse = props.series[index].data;
	const over = toParse.length > steps.value;
	const len = over ? steps.value : toParse.length;
	let output = [];
	for (let i = 0; i < len; i++) {
		output.push(toParse[i]);
	}

	if (over) {
		output.push(toParse.slice(steps.value, toParse.length).reduce((a, b) => a + b));
	}
	return output;
});
const parsedLabels = computed(() => {
	const over = props.chart_config.categories.length > steps.value;
	const len = over ? steps.value : props.chart_config.categories.length;
	let output = [];
	for (let i = 0; i < len; i++)
		output.push(props.chart_config.categories[i]);
	if (over)
		output.push("其他");
	return output;
});
const sum = computed(() => {
	return Math.round(parsedSeries.value.reduce((a, b) => a + b) * 100) / 100;
});

// chartOptions needs to be in the bottom since it uses computed data
const chartOptions = ref({
	chart: {
		offsetY: 10
	},
	colors:
		props.series.length >= steps.value
			? [...props.chart_config.color, "#848c94"]
			: props.chart_config.color,
	dataLabels: {
		formatter: function(
			_val,
			{ seriesIndex, w }
		) {
			let value = w.globals.labels[seriesIndex];
			return value.length > 7 ? value.slice(0, 6) + "..." : value;
		}
	},
	labels: parsedLabels,
	legend: {
		show: false
	},
	plotOptions: {
		pie: {
			dataLabels: {
				offset: 15
			},
			donut: {
				size: "77.5%"
			}
		}
	},
	stroke: {
		colors: ["#282a2c"],
		show: true,
		width: 3
	},
	tooltip: {
		followCursor: false,
		custom: function({ series, seriesIndex, w }) {
			// The class "chart-tooltip" could be edited in /assets/styles/chartStyles.css
			return (
				"<div class=\"chart-tooltip\"\>" +
				"<h6>" +
				w.globals.labels[seriesIndex] +
				"</h6>" +
				"<span>" +
				series[seriesIndex] +
				` ${props.chart_config.unit}` +
				"</span>" +
				"</div>"
			);
		}
	}
});

const selectedIndex = ref(null);

function handleDataSelection(_e, _chartContext, config) {
	if (!props.map_filter || !props.map_filter_on) {
		return;
	}
	if (
		`${config.dataPointIndex}-${config.seriesIndex}` !== selectedIndex.value
	) {
		// Supports filtering by xAxis
		if (props.map_filter.mode === "byParam") {
			emits(
				"filterByParam",
				props.map_filter,
				props.map_config,
				config.w.globals.labels[config.dataPointIndex],
				null
			);
		}
		// Supports filtering by xAxis
		else if (props.map_filter.mode === "byLayer") {
			emits(
				"filterByLayer",
				props.map_config,
				config.w.globals.labels[config.dataPointIndex]
			);
		}
		selectedIndex.value = `${config.dataPointIndex}-${config.seriesIndex}`;
	} else {
		if (props.map_filter.mode === "byParam") {
			emits("clearByParamFilter", props.map_config);
		} else if (props.map_filter.mode === "byLayer") {
			emits("clearByLayerFilter", props.map_config);
		}
		selectedIndex.value = null;
	}
}
</script>

<template>
	<div
		v-if="activeChart === 'DonutChart3D'"
		class="donutchart"
	>
		<VueApexCharts
			width="100%"
			type="donut"
			:options="chartOptions"
			:series="parsedSeries"
			@data-point-selection="handleDataSelection"
		/>
		<div class="donutchart-title">
			<h5>{{ districtName }} 總合</h5>
			<h6>{{ sum }}</h6>
		</div>
	</div>
</template>

<style scoped lang="scss">
.donutchart {
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow-y: visible;

	&-title {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: absolute;

		h5 {
			margin: 0;
			color: var(--color-complement-text);
		}

		h6 {
			margin: 0;
			color: var(--color-complement-text);
			font-size: var(--font-m);
			font-weight: 400;
		}
	}
}
</style>
