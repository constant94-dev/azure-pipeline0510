package com.tvpatron.member.repository.custom;

import com.tvpatron.member.domain.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CollectionRepositoryCustom {
    Page<Collection> findCollectionArtworksByEmailOrderByIdDesc(String email, Pageable pageable);


    Page<Collection> findCollectionsByEmail(String email, String localization, Pageable pageable);

}
