import axios from 'axios';

export const getCurrentCity = () => {
	const localCity = JSON.parse(localStorage.getItem('hkzf_city'));
	if (!localCity) {
		// 如果没有
		return new Promise((resolve, reject) => {
			const curCity = new window.BMap.LocalCity();
			curCity.get(async res => {
				try {
					const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`);
					// 存储到本地
					localStorage.setItem('hkzf_city', JSON.stringify(result.data.body));
					resolve(result.data.body);
				} catch (e) {
					reject(e);
				}
			});
		});
	}
    // 如果有
    return Promise.resolve(localCity);
};
