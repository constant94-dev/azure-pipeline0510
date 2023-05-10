package digital.patron.webmobile.advertisement.service;

import digital.patron.webmobile.advertisement.domain.Advertisement;

public interface AdvertisementService {
    Advertisement getAdvertisementByName(String name);
}
