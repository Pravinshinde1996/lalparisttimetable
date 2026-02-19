import { Component } from '@angular/core';
import { BusService } from '../../services/bus.service';
import { Depot } from '../../models/depot.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depot-search',
  templateUrl: './depot-search.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [BusService],
  styleUrls: ['./depot-search.component.css'],
})
export class DepotSearchComponent {
  depotName: string = '';
  depots: Depot[] = [];
  notFound: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredSuggestions: string[] = [];
  showSuggestions: boolean = false;
  allDepots: string[] = [
    'Sangli (सांगली)',
    'Kolhapur (कोल्हापूर)',
    'Satara (सातारा)',
    'Pune (पुणे)',
    'Jath (जत)',
    'Ajara (अजारा)',
    'Ahmedpur (अहमदपुर)',
    'Aheri (अहिर)',
    'Akkalkot (अक्कलकोट)',
    'Akkalkuwa (अक्कलकोवा)',
    'Akluj (अक्लूज)',
    'Akole (अकोले)',
    'Akot (अकोट)',
    'Alephata (अलेफाटा)',
    'Alibag (अलीबाग)',
    'Amalner (अमळनेर)',
    'Ambad (अंबड)',
    'Ambajogai (अंबाजोगाई)',
    'Amboli (अंबोली)',
    'Amravati (अमरावती)',
    'Arnala (अर्नाळा)',
    'Ashti (अष्टी)',
    'Atpadi (अटपाडी)',
    'Aundha Nagnath (औंधा नागनाथ)',
    'Badnera (बदनेरा)',
    'Banda (बांदा)',
    'Baramati (बारामती)',
    'Barshi (बार्शी)',
    'Beed (बीड)',
    'Bhandara (भंडारा)',
    'Bhiwandi (भिवंडी)',
    'Bhokar (भोकर)',
    'Bhoom (भूूम)',
    'Bhor (भोर)',
    'Bhusawal (भुसावळ)',
    'Bhimashankar (भिमाशंकर)',
    'Biloli (बिलोली)',
    'Bodwad (बोडवाड)',
    'Boisar (बोईसर)',
    'Borivali (बोरिवली)',
    'Buldhana (बुलढाणा)',
    'Chalisgaon (चाळीसगाव)',
    'Chandgad (चांदगड)',
    'Chandrapur (चंद्रपूर)',
    'Chandur Bazar (चांदूर बाजार)',
    'Chandur Railway (चांदूर रेल्वे)',
    'Chatrapati Sambhaji Nagar (छत्रपती संभाजी नगर)',
    'Chikhali (चिखली)',
    'Chimur (चिमूर)',
    'Chiplun (चिपळूण)',
    'Chopda (चोपडा)',
    'Dahanu (दहाणू)',
    'Dapoli (दापोली)',
    'Daund (दौंड)',
    'Degloor (देग्लूर)',
    'Devgad (देवगड)',
    'Devrukh (देवरुख)',
    'Dharangaon (धरंगाव)',
    'Dharur (धरूर)',
    'Dhule (धुळे)',
    'Dondaicha (डोंडाईचा)',
    'Dindori (दिंडोरी)',
    'Digras (दिग्रस)',
    'Erandol (एरंडोल)',
    'Gadchiroli (गडचिरोली)',
    'Gadhinglaj (गडहिंग्लज)',
    'Gangapur (गंगापुर)',
    'Gargoti (गारगोटी)',
    'Georai (गेवराई)',
    'Ghoti (घोटी)',
    'Ghansawangi (घनसावंगी)',
    'Gondia (गोंदिया)',
    'Guhagar (गुहागर)',
    'Hadgaon (हदगाव)',
    'Hatkanangale (हातकणंगले)',
    'Hingoli (हिंगोली)',
    'Hydrabad (हैदराबाद)',
    'Ichalkaranji (इचलकरंजी)',
    'Igatpuri (इगतपुरी)',
    'Indapur (इंदापूर)',
    'Ishwarpur (ईश्वरपुर)',
    'Jalgaon (जळगाव)',
    'Jalna (जालना)',
    'Jamkhed (जामखेड)',
    'Jamner (जामनेर)',
    'Jafrabad (जाफराबाद)',
    'Jawhar (जव्हार)',
    'Jejuri (जेजुरी)',
    'Jintur (जिंतूर)',
    'Junnar (जुन्नर)',
    'Jyotiba (ज्योतिबा)',
    'Kagal (कागल)',
    'kalamnuri (कळमनुरी)',
    'Kalamb (कलंब)',
    'Kalwan (कळवण)',
    'Kalyan (कल्याण)',
    'Kandhar (कंधार)',
    'Kankavli (कणकवली)',
    'Kannad (कन्नड)',
    'Karad (कराड)',
    'Karanja (करंजा)',
    'Karjat Ahmednahar (कर्जत अहमदनगर)',
    'Kavathe Mahankal (कवठे महाकाल)',
    'Khamgaon (खामगाव)',
    'Khed (खेड)',
    'Khopoli (खोपोली)',
    'Kinwat (किनवट)',
    'Koregaon (कोरेगाव)',
    'Kopargaon (कोपरगाव)',
    'Kudal (कुडाळ)',
    'Kurduvadi (कुर्डुवाडी)',
    'Kurla Nehru Nagar (कुर्ला नेहरू नगर)',
    'Lanja (लांजा)',
    'Lasalgaon (लासलगाव)',
    'Latur (लातूर)',
    'Loha (लोहा)',
    'Lonand (लोणंद)',
    'Lonavala (लोणावळा)',
    'Mahabaleshwar (महाबळेश्वर)',
    'Mahad (महाड)',
    'Mahur (माहूर)',
    'Majalgaon (माजलगाव)',
    'Malegaon (मालेगाव)',
    'Maliwada (माळीवाडा)',
    'Malkapur Buldhana (मलकापूर-बुलढाणा)',
    'Malkapur Kolhapur (मलकापूर-कोल्हापूर)',
    'Malvan (मालवण)',
    'Manchar (मंचर)',
    'Mandangad (मंडणगड)',
    'Mangaon (माणगाव)',
    'Mangrulpir (मंगरुळपिर)',
    'Manmad (मनमाड)',
    'Medha (मेढा)',
    'Mehkar (मेहकर)',
    'Miraj (मिरज)',
    'mukhed (मुखेड)',
    'Muktainagar (मुक्ताईनगर)',
    'Mumbai Central (मुंबई सेंट्रल)',
    'parel (परळ)',
    'Mantha (मंठा)',
    'Murud (मुरुड)',
    'Murbad (मुरबाड)',
    'Murum (मुरूम)',
    'Nagpur Ganeshpeth (नागपूर गणेशपेठ)',
    'Narayangaon (नारायणगाव)',
    'Nalasopara (नालासोपारा)',
    'Naldurg (नळदुर्ग)',
    'Nanded (नांदेड)',
    'Nandgaon (नांदगाव)',
    'Nandurbar (नंदुरबार)',
    'Nrusinhwadi (नृसिंहवाडी)',
    'Nashik-mahamarg (नाशिक महामार्ग)',
    'Nashik CBS (नाशिक सीबीएस)',
    'Nashik Road (नाशिक रोड)',
    'Navapur (नवापूर)',
    'Shivajinagar Wakdewadi (शिवाजीनगर वाकडेवाडी)',
    'Newasa (नेवासा)',
    'Nira (नीरा)',
    'Nilanga (निलंगा)',
    'Dharashiv Osmanabad (धाराशिव-उस्मानाबाद)',
    'Pachora (पाचोरा)',
    'Paithan (पैठण)',
    'Palghar (पालघर)',
    'Pali Raigad (पाली रायगड)',
    'Palus (पलूस)',
    'Pandharpur (पंढरपूर)',
    'Pandharkawda (पंढरकवडा)',
    'Panjim Goa (पणजी गोवा)',
    'Panvel (पनवेल)',
    'Paranda (परंडा)',
    'Paratwada (परतवाडा)',
    'Parli (परळी)',
    'Parbhani (परभणी)',
    'Parner (पारनेर)',
    'Partur (परतूर)',
    'Pathardi (पाथर्डी)',
    'Patan (पाटण)',
    'Pathri (पाथरी)',
    'Patoda (पाटोडा)',
    'Pen (पेन)',
    'Phaltan (फालटण)',
    'Vallabhnagar Pune (वल्लभनगर, पुणे)',
    'Poladpur (पोळादपूर)',
    'Pune Station (पुणे स्टेशन)',
    'Pusad (पुसद)',
    'Radhanagari (राधानगरी)',
    'Rahuri (राहुरी)',
    'Rajapur (राजापूर)',
    'Rajgurunagar (राजगुरुनगर)',
    'Rajur (राजूर)',
    'Rajura (राजुरा)',
    'Ratnagiri (रत्नागिरी)',
    'Raver (रावेर)',
    'Risod (रिसोद)',
    'Revdanda (रेवदंडा)',
    'Roha (रोहा)',
    'Sakri (साक्री)',
    'Sakoli (साकोली)',
    'Sangamner (सांगमनेर)',
    'Sambhajinagar kolhapur (संभाजी नगर, कोल्हापूर)',
    'Sangola (सांगोला)',
    'Saswad (सासवड)',
    'Satana (सताणा)',
    'Satara (सातारा)',
    'Satpur (सतपुर)',
    'Sawantwadi (सावंतवाडी)',
    'Shahada (शहादा)',
    'Shahapur (शाहापुर)',
    'Shegaon (शेगाव)',
    'Shevgaon (शेवगाव)',
    'Shindkheda (शिंदखेड़ा)',
    'Shirala (शिराळा)',
    'Shirpur (शिरपूर)',
    'Shirdi (शिर्डी)',
    'Shirur (शिरूर)',
    'Shirur Tajband (शिरूर ताजबंद)',
    'Shrigonda (श्रीगोंदा)',
    'Shriramapur (श्रीरामपूर)',
    'Shrivardhan (श्रीवर्धन)',
    'Sillod (सिल्लोड)',
    'Sindhudurg (सिंधुदुर्ग)',
    'Sinnar (सिन्नर)',
    'Solpur (सोलापूर)',
    'Swargate (स्वारगेट)',
    'Surat (सूरत)',
    'Tala (तळा)',
    'Talegaon pune (तळेगाव पुणे)',
    'Taloda (तळोदा)',
    'Tarakpur Ahmednagar (तारकपुर, अहमदनगर)',
    'Tasgaon (तासगाव)',
    'Telhara (तेल्हारा)',
    'Tembhurni (टेंभुर्णी)',
    'Thane Khopat (ठाणे खोपट)',
    'Thane Railway Station (ठाणे रेल्वे स्टेशन)',
    'Thane Vandana (ठाणे वंदना)',
    'Tirora (तिरोरा)',
    'Trimbakeshwar (त्र्यंबकेश्वर)',
    'Tuljapur (तुळजापूर)',
    'Tumsar (तुमसर)',
    'Udgir (उदगीर)',
    'Umarkhed (उमरखेड)',
    'Umarga (उमरगा)',
    'Umred  (उमरेड)',
    'Uran (उरण)',
    'Vaijapur (वैजापूर)',
    'Vasmat (वासमट)',
    'Vasai (वसई)',
    'Vengurla (वेंगुर्ला)',
    'Vijaydurg (विजयदुर्ग)',
    'Vita (विटा)',
    'Vitthalwadi (विठ्ठलवाडी)',
    'Wada (वाडा)',
    'Vaduj (वडूज)',
    'Wai (वाई)',
    'Wani (वणी)',
    'Wardha (वर्धा)',
    'Warud (वारुड)',
    'Washim (वाशिम)',
    'yavatmal (यवतमाळ)',
    'yawal (यावल)',
    'yeola (येवला)',
  ];

  constructor(private busService: BusService) {}

  search() {
    const city = this.depotName.trim().toLowerCase();
    //test

    if (!city) return;

    this.busService.getCityData(city).subscribe({
      next: (data) => {
        data.sort((a: any, b: any) => a.depot.toLowerCase().localeCompare(b.depot.toLowerCase()));

        this.depots = data;
        this.notFound = false;
        this.currentPage = 1;
      },
      error: () => {
        this.depots = [];
        this.notFound = true;
        this.currentPage = 1;
      },
    });
  }

  get paginatedDepots() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.depots.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.depots.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.depots.sort((a: any, b: any) => {
      let valueA;
      let valueB;

      if (column === 'depot') {
        valueA = a.depot.toLowerCase();
        valueB = b.depot.toLowerCase();
      }

      if (column === 'time') {
        valueA = a.departureTimes[0];
        valueB = b.departureTimes[0];
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onInputChange(value: string) {
    this.depotName = value;

    const cleanedValue = value.trim().toLowerCase();

    // ✅ If input is empty OR not exact match → remove table
    if (!cleanedValue || !this.allDepots.some((depot) => depot.toLowerCase() === cleanedValue)) {
      this.depots = [];
      this.notFound = false;
      this.currentPage = 1;
    }

    // Suggestions logic
    if (!cleanedValue) {
      this.filteredSuggestions = [];
      this.showSuggestions = false;
      return;
    }

    this.filteredSuggestions = this.allDepots.filter((depot) =>
      depot.toLowerCase().includes(cleanedValue),
    );

    this.showSuggestions = true;
  }

  selectSuggestion(depot: string) {
    this.depotName = depot;
    this.filteredSuggestions = [];
    this.showSuggestions = false;
  }
}
