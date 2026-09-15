const mongoose = require('mongoose');
require('dotenv').config();
const Location = require('./models/Location');

const citiesData = [
  // Andhra Pradesh
  { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Guntur', state: 'Andhra Pradesh' },
  { name: 'Nellore', state: 'Andhra Pradesh' },
  { name: 'Kurnool', state: 'Andhra Pradesh' },
  { name: 'Rajahmundry', state: 'Andhra Pradesh' },
  { name: 'Tirupati', state: 'Andhra Pradesh' },
  { name: 'Kakinada', state: 'Andhra Pradesh' },
  { name: 'Anantapur', state: 'Andhra Pradesh' },
  { name: 'Anakapalli', state: 'Andhra Pradesh' },

  // Arunachal Pradesh
  { name: 'Itanagar', state: 'Arunachal Pradesh' },
  { name: 'Tawang', state: 'Arunachal Pradesh' },
  { name: 'Pasighat', state: 'Arunachal Pradesh' },

  // Assam
  { name: 'Guwahati', state: 'Assam' },
  { name: 'Silchar', state: 'Assam' },
  { name: 'Dibrugarh', state: 'Assam' },
  { name: 'Jorhat', state: 'Assam' },

  // Bihar
  { name: 'Patna', state: 'Bihar' },
  { name: 'Gaya', state: 'Bihar' },
  { name: 'Bhagalpur', state: 'Bihar' },
  { name: 'Muzaffarpur', state: 'Bihar' },

  // Chhattisgarh
  { name: 'Raipur', state: 'Chhattisgarh' },
  { name: 'Bhilai', state: 'Chhattisgarh' },
  { name: 'Bilaspur', state: 'Chhattisgarh' },

  // Goa
  { name: 'Panaji', state: 'Goa' },
  { name: 'Margao', state: 'Goa' },

  // Gujarat
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Vadodara', state: 'Gujarat' },
  { name: 'Rajkot', state: 'Gujarat' },
  { name: 'Bhavnagar', state: 'Gujarat' },
  { name: 'Jamnagar', state: 'Gujarat' },
  { name: 'Gandhinagar', state: 'Gujarat' },

  // Haryana (State & NCR)
  { name: 'Faridabad', state: 'Haryana' },
  { name: 'Gurugram', state: 'Haryana' },
  { name: 'Panipat', state: 'Haryana' },
  { name: 'Ambala', state: 'Haryana' },
  { name: 'IMT Manesar', state: 'Haryana' },
  { name: 'Udyog Vihar Gurugram', state: 'Haryana' },
  { name: 'Sohna', state: 'Haryana' },
  { name: 'Pataudi', state: 'Haryana' },
  { name: 'Farrukhnagar', state: 'Haryana' },
  { name: 'Sonipat', state: 'Haryana' },
  { name: 'Kundli', state: 'Haryana' },
  { name: 'Rai Industrial Area', state: 'Haryana' },
  { name: 'Murthal', state: 'Haryana' },
  { name: 'Bahadurgarh', state: 'Haryana' },
  { name: 'Sampla', state: 'Haryana' },
  { name: 'Jhajjar', state: 'Haryana' },
  { name: 'Rohtak', state: 'Haryana' },
  { name: 'Rewari', state: 'Haryana' },
  { name: 'Bawal', state: 'Haryana' },
  { name: 'Dharuhera', state: 'Haryana' },
  { name: 'Ballabhgarh', state: 'Haryana' },
  { name: 'Sector 24 Faridabad', state: 'Haryana' },
  { name: 'Sector 25 Faridabad', state: 'Haryana' },
  { name: 'Sector 6 Faridabad', state: 'Haryana' },
  { name: 'NIT Faridabad', state: 'Haryana' },
  { name: 'Palwal', state: 'Haryana' },
  { name: 'Hodal', state: 'Haryana' },
  { name: 'Prithla', state: 'Haryana' },
  { name: 'Samalkha', state: 'Haryana' },
  { name: 'Karnal', state: 'Haryana' },
  { name: 'Jind', state: 'Haryana' },
  { name: 'Nuh', state: 'Haryana' },
  { name: 'Tauru', state: 'Haryana' },
  { name: 'Ganaur', state: 'Haryana' },
  { name: 'Kharkhoda', state: 'Haryana' },
  { name: 'Beri', state: 'Haryana' },
  { name: 'Meham', state: 'Haryana' },
  { name: 'Gohana', state: 'Haryana' },
  { name: 'Bilaspur Haryana', state: 'Haryana' },

  // Himachal Pradesh
  { name: 'Shimla', state: 'Himachal Pradesh' },
  { name: 'Dharamshala', state: 'Himachal Pradesh' },

  // Jharkhand
  { name: 'Ranchi', state: 'Jharkhand' },
  { name: 'Jamshedpur', state: 'Jharkhand' },
  { name: 'Dhanbad', state: 'Jharkhand' },

  // Karnataka
  { name: 'Bengaluru', state: 'Karnataka' },
  { name: 'Mysuru', state: 'Karnataka' },
  { name: 'Hubballi', state: 'Karnataka' },
  { name: 'Mangaluru', state: 'Karnataka' },
  { name: 'Belagavi', state: 'Karnataka' },

  // Kerala
  { name: 'Thiruvananthapuram', state: 'Kerala' },
  { name: 'Kochi', state: 'Kerala' },
  { name: 'Kozhikode', state: 'Kerala' },
  { name: 'Thrissur', state: 'Kerala' },

  // Madhya Pradesh
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Jabalpur', state: 'Madhya Pradesh' },
  { name: 'Gwalior', state: 'Madhya Pradesh' },
  { name: 'Ujjain', state: 'Madhya Pradesh' },

  // Maharashtra
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Thane', state: 'Maharashtra' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Kalyan-Dombivli', state: 'Maharashtra' },
  { name: 'Vasai-Virar', state: 'Maharashtra' },
  { name: 'Aurangabad', state: 'Maharashtra' },
  { name: 'Navi Mumbai', state: 'Maharashtra' },

  // Manipur
  { name: 'Imphal', state: 'Manipur' },

  // Meghalaya
  { name: 'Shillong', state: 'Meghalaya' },

  // Mizoram
  { name: 'Aizawl', state: 'Mizoram' },

  // Nagaland
  { name: 'Kohima', state: 'Nagaland' },
  { name: 'Dimapur', state: 'Nagaland' },

  // Odisha
  { name: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Cuttack', state: 'Odisha' },
  { name: 'Rourkela', state: 'Odisha' },

  // Punjab
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Amritsar', state: 'Punjab' },
  { name: 'Jalandhar', state: 'Punjab' },
  { name: 'Patiala', state: 'Punjab' },

  // Rajasthan (State & NCR)
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Jodhpur', state: 'Rajasthan' },
  { name: 'Kota', state: 'Rajasthan' },
  { name: 'Bikaner', state: 'Rajasthan' },
  { name: 'Ajmer', state: 'Rajasthan' },
  { name: 'Alwar', state: 'Rajasthan' },
  { name: 'Bhiwadi', state: 'Rajasthan' },
  { name: 'Neemrana', state: 'Rajasthan' },
  { name: 'Behror', state: 'Rajasthan' },
  { name: 'Tapukara', state: 'Rajasthan' },
  { name: 'Khushkhera', state: 'Rajasthan' },
  { name: 'Tijara', state: 'Rajasthan' },
  { name: 'Shahjahanpur Rajasthan', state: 'Rajasthan' },
  { name: 'Kahrani', state: 'Rajasthan' },
  { name: 'Chopanki', state: 'Rajasthan' },

  // Sikkim
  { name: 'Gangtok', state: 'Sikkim' },

  // Tamil Nadu
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { name: 'Salem', state: 'Tamil Nadu' },
  { name: 'Erode', state: 'Tamil Nadu' },

  // Telangana
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Warangal', state: 'Telangana' },
  { name: 'Nizamabad', state: 'Telangana' },

  // Tripura
  { name: 'Agartala', state: 'Tripura' },

  // Uttar Pradesh (State & NCR)
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Meerut', state: 'Uttar Pradesh' },
  { name: 'Allahabad', state: 'Uttar Pradesh' },
  { name: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Greater Noida', state: 'Uttar Pradesh' },
  { name: 'Greater Noida West', state: 'Uttar Pradesh' },
  { name: 'Surajpur', state: 'Uttar Pradesh' },
  { name: 'Kasna', state: 'Uttar Pradesh' },
  { name: 'Ecotech Greater Noida', state: 'Uttar Pradesh' },
  { name: 'Dadri', state: 'Uttar Pradesh' },
  { name: 'Jewar', state: 'Uttar Pradesh' },
  { name: 'Sahibabad', state: 'Uttar Pradesh' },
  { name: 'Loni', state: 'Uttar Pradesh' },
  { name: 'Mohan Nagar Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Kavi Nagar Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Raj Nagar Extension', state: 'Uttar Pradesh' },
  { name: 'South Side GT Road Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Muradnagar', state: 'Uttar Pradesh' },
  { name: 'Modinagar', state: 'Uttar Pradesh' },
  { name: 'Hapur', state: 'Uttar Pradesh' },
  { name: 'Pilkhuwa', state: 'Uttar Pradesh' },
  { name: 'Dasna', state: 'Uttar Pradesh' },
  { name: 'Sikandrabad', state: 'Uttar Pradesh' },
  { name: 'Bulandshahr', state: 'Uttar Pradesh' },
  { name: 'Khurja', state: 'Uttar Pradesh' },
  { name: 'Baghpat', state: 'Uttar Pradesh' },
  { name: 'Baraut', state: 'Uttar Pradesh' },
  { name: 'Khekra', state: 'Uttar Pradesh' },
  { name: 'Modipuram', state: 'Uttar Pradesh' },
  { name: 'Partapur Meerut', state: 'Uttar Pradesh' },
  { name: 'Muzaffarnagar', state: 'Uttar Pradesh' },
  { name: 'Shamli', state: 'Uttar Pradesh' },
  { name: 'Aligarh', state: 'Uttar Pradesh' },
  { name: 'Hathras', state: 'Uttar Pradesh' },
  { name: 'Mathura', state: 'Uttar Pradesh' },
  { name: 'Vrindavan', state: 'Uttar Pradesh' },
  { name: 'Garhmukteshwar', state: 'Uttar Pradesh' },
  { name: 'Anupshahr', state: 'Uttar Pradesh' },
  { name: 'Jahangirabad', state: 'Uttar Pradesh' },

  // Uttarakhand
  { name: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Haridwar', state: 'Uttarakhand' },

  // West Bengal
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Asansol', state: 'West Bengal' },
  { name: 'Siliguri', state: 'West Bengal' },
  { name: 'Durgapur', state: 'West Bengal' },

  // Delhi (NCT & Major Industrial/Commercial Clusters)
  { name: 'New Delhi', state: 'Delhi' },
  { name: 'Okhla Industrial Area', state: 'Delhi' },
  { name: 'Mayapuri Industrial Area', state: 'Delhi' },
  { name: 'Naraina Industrial Area', state: 'Delhi' },
  { name: 'Kirti Nagar', state: 'Delhi' },
  { name: 'Wazirpur Industrial Area', state: 'Delhi' },
  { name: 'Bawana Industrial Area', state: 'Delhi' },
  { name: 'Narela Industrial Area', state: 'Delhi' },
  { name: 'Patparganj Industrial Area', state: 'Delhi' },
  { name: 'Mangolpuri Industrial Area', state: 'Delhi' },
  { name: 'Badli Industrial Area', state: 'Delhi' },
  { name: 'Anand Parbat Industrial Area', state: 'Delhi' },
  { name: 'Lawrence Road Industrial Area', state: 'Delhi' },
  { name: 'Mohan Cooperative', state: 'Delhi' },
  { name: 'Udyog Nagar Delhi', state: 'Delhi' },
  { name: 'Jhandewalan', state: 'Delhi' },
  { name: 'Connaught Place', state: 'Delhi' },
  { name: 'Nehru Place', state: 'Delhi' },
  { name: 'Karol Bagh', state: 'Delhi' },
  { name: 'Chandni Chowk', state: 'Delhi' },
  { name: 'Rohini', state: 'Delhi' },
  { name: 'Dwarka', state: 'Delhi' },
  { name: 'Janakpuri', state: 'Delhi' },
  { name: 'Pitampura', state: 'Delhi' },
  { name: 'Laxmi Nagar', state: 'Delhi' },
  { name: 'Saket', state: 'Delhi' },
  { name: 'Vasant Kunj', state: 'Delhi' },
  { name: 'Shahdara', state: 'Delhi' },
  { name: 'Kashmere Gate', state: 'Delhi' },
  { name: 'Najafgarh', state: 'Delhi' },
  { name: 'Alipur Delhi', state: 'Delhi' },
  { name: 'Mundka', state: 'Delhi' },
  { name: 'Tikri Kalan', state: 'Delhi' },
  { name: 'Nangloi', state: 'Delhi' },
  { name: 'Tilak Nagar', state: 'Delhi' },
  { name: 'Lajpat Nagar', state: 'Delhi' },

  // Other Union Territories
  { name: 'Port Blair', state: 'Andaman and Nicobar Islands' },
  { name: 'Chandigarh', state: 'Chandigarh' },
  { name: 'Daman', state: 'Dadra and Nagar Haveli and Daman and Diu' },
  { name: 'Srinagar', state: 'Jammu and Kashmir' },
  { name: 'Jammu', state: 'Jammu and Kashmir' },
  { name: 'Leh', state: 'Ladakh' },
  { name: 'Kavaratti', state: 'Lakshadweep' },
  { name: 'Puducherry', state: 'Puducherry' },
];

const locations = citiesData.map(city => ({
  name: city.name,
  slug: city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  state: city.state,
  isActive: true,
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Location.deleteMany({});
    await Location.insertMany(locations);
    console.log(`Seeded ${locations.length} locations successfully`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err);
    process.exit(1);
  });
