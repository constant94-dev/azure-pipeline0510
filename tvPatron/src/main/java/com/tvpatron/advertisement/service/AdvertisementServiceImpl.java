package com.tvpatron.advertisement.service;

import com.tvpatron.advertisement.domain.Advertisement;
import com.tvpatron.advertisement.repository.AdvertisementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdvertisementServiceImpl implements AdvertisementService{
    private final AdvertisementRepository advertisementRepository;
    @Override
    public Advertisement getAdvertisementByName(String name){
        return advertisementRepository.findByName(name).orElse(null);
    }
}
