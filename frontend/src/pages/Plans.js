import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

import PlansCard from '../components/PlansCard';
import PageLayout from '../layout/PageLayout';
import APP_CONFIG from '../config/appConfig';
import useWatchLoginStatus from '../hooks/useWatchLoginStatus';

const Plans = () => {
    useWatchLoginStatus();
    return (
        <PageLayout title="Plans">
            <div className="c-Plans">
                <div className="c-Plans__Top">
                    <h1 className="c-Plans__Heading">Choose the Plan that's Right for You</h1>
                    <p><b>7 Day Free Trial of Premium Plan</b> for First Time Subscribers for either Plans</p>
                </div>

                <div className="c-Plans__Cards">
                    <PlansCard
                        name="Standard"
                        price="9.90"
                        description="It's now or never, sign up now to waste money!"
                        planID="1" // hardcoded
                    />
                    <PlansCard
                        name="Premium"
                        price="15.90"
                        description="A slightly more expensive plan than standard plan."
                        planID="2" // hardcoded
                    />
                </div>
            </div>
        </PageLayout>
    );
};

export default Plans;